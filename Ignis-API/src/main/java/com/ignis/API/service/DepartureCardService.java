package com.ignis.API.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ignis.API.dto.request.DepartureCardRequest;
import com.ignis.API.dto.request.VehicleCrewRequest;
import com.ignis.API.dto.response.CrewMemberResponse;
import com.ignis.API.dto.response.DepartureCardDetailsResponse;
import com.ignis.API.dto.response.DepartureCardHistoryResponse;
import com.ignis.API.dto.response.DepartureCardResponse;
import com.ignis.API.dto.response.VehicleCrewResponse;
import com.ignis.API.entity.Card;
import com.ignis.API.entity.City;
import com.ignis.API.entity.EmailSend;
import com.ignis.API.entity.EmailStatus;
import com.ignis.API.entity.Firefighter;
import com.ignis.API.entity.FirefighterActionRole;
import com.ignis.API.entity.Garage;
import com.ignis.API.entity.Incident;
import com.ignis.API.entity.Place;
import com.ignis.API.entity.Street;
import com.ignis.API.entity.TypeCard;
import com.ignis.API.entity.TypeFunction;
import com.ignis.API.entity.VehicleToCard;
import com.ignis.API.exception.ResourceNotFoundException;
import com.ignis.API.repository.CardRepository;
import com.ignis.API.repository.CityRepository;
import com.ignis.API.repository.EmailSendRepository;
import com.ignis.API.repository.EmailStatusRepository;
import com.ignis.API.repository.FirefighterActionRoleRepository;
import com.ignis.API.repository.FirefighterRepository;
import com.ignis.API.repository.GarageRepository;
import com.ignis.API.repository.IncidentRepository;
import com.ignis.API.repository.PlaceRepository;
import com.ignis.API.repository.StreetRepository;
import com.ignis.API.repository.TypeCardRepository;
import com.ignis.API.repository.TypeFunctionRepository;
import com.ignis.API.repository.VehicleToCardRepository;

@Service
public class DepartureCardService {

    private final CardRepository cardRepository;
    private final PlaceRepository placeRepository;
    private final EmailSendRepository emailSendRepository;
    private final EmailStatusRepository emailStatusRepository;
    private final CityRepository cityRepository;
    private final StreetRepository streetRepository;
    private final IncidentRepository incidentRepository;
    private final GarageRepository garageRepository;
    private final FirefighterRepository firefighterRepository;
    private final TypeFunctionRepository typeFunctionRepository;
    private final VehicleToCardRepository vehicleToCardRepository;
    private final FirefighterActionRoleRepository firefighterActionRoleRepository;
    private final TypeCardRepository typeCardRepository;

    public DepartureCardService(
            CardRepository cardRepository,
            PlaceRepository placeRepository,
            EmailSendRepository emailSendRepository,
            EmailStatusRepository emailStatusRepository,
            CityRepository cityRepository,
            StreetRepository streetRepository,
            IncidentRepository incidentRepository,
            GarageRepository garageRepository,
            FirefighterRepository firefighterRepository,
            TypeFunctionRepository typeFunctionRepository,
            VehicleToCardRepository vehicleToCardRepository,
            FirefighterActionRoleRepository firefighterActionRoleRepository,
            TypeCardRepository typeCardRepository
    ) {
        this.cardRepository = cardRepository;
        this.placeRepository = placeRepository;
        this.emailSendRepository = emailSendRepository;
        this.emailStatusRepository = emailStatusRepository;
        this.cityRepository = cityRepository;
        this.streetRepository = streetRepository;
        this.incidentRepository = incidentRepository;
        this.garageRepository = garageRepository;
        this.firefighterRepository = firefighterRepository;
        this.typeFunctionRepository = typeFunctionRepository;
        this.vehicleToCardRepository = vehicleToCardRepository;
        this.firefighterActionRoleRepository = firefighterActionRoleRepository;
        this.typeCardRepository = typeCardRepository;
    }

    @Transactional
    public DepartureCardResponse createDepartureCard(DepartureCardRequest request, String login) {

        Firefighter createdBy = firefighterRepository.findByUserLogin(login)
                .orElseThrow(() -> new ResourceNotFoundException(
                "Nie znaleziono strażaka dla użytkownika: " + login
        ));
        City city = cityRepository.findById(request.getCityId())
                .orElseThrow(() -> new ResourceNotFoundException("Nie znaleziono miejscowości."));

        Street street = null;

        if (request.getStreetId() != null) {
            street = streetRepository.findById(request.getStreetId())
                    .orElseThrow(() -> new ResourceNotFoundException("Nie znaleziono ulicy."));
        }

        Incident incident = incidentRepository.findById(request.getIncidentId())
                .orElseThrow(() -> new ResourceNotFoundException("Nie znaleziono powodu wyjazdu."));

        EmailStatus emailStatus = emailStatusRepository.findByName("Nie wysłano")
                .orElseThrow(() -> new ResourceNotFoundException("Nie znaleziono statusu e-mail: Nie wysłano."));

        Place place = getOrCreatePlace(city, street, createdBy);

        EmailSend emailSend = emailSendRepository.save(new EmailSend(emailStatus));

        Long commanderId = request.getCrews()
                .stream()
                .filter(crew -> crew.getCommanderId() != null)
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Nie wskazano dowódcy."))
                .getCommanderId();

        Firefighter commander = firefighterRepository.findById(commanderId)
                .orElseThrow(() -> new ResourceNotFoundException("Nie znaleziono dowódcy."));

        TypeCard typeCard = typeCardRepository.findByName("Karta wyjazdu")
                .orElseThrow(() -> new ResourceNotFoundException("Nie znaleziono typu karty: Karta wyjazdu."));

        Card card = new Card(
                request.getDepartureNumber(),
                LocalDate.parse(request.getDate()),
                LocalTime.parse(request.getTimeDeparture()),
                LocalTime.parse(request.getTimeArrival()),
                request.getDistance(),
                place,
                incident,
                emailSend,
                commander,
                typeCard,
                createdBy
        );

        Card savedCard = cardRepository.save(card);

        saveCrews(request, savedCard);

        return new DepartureCardResponse(
                savedCard.getId(),
                savedCard.getDepartureNumber(),
                "Karta wyjazdu została zapisana."
        );
    }

    private void saveCrews(DepartureCardRequest request, Card card) {
        if (request.getCrews() == null || request.getCrews().isEmpty()) {
            return;
        }

        TypeFunction driverFunction = getTypeFunction("Kierowca");
        TypeFunction commanderFunction = getTypeFunction("Dowódca");
        TypeFunction firefighterFunction = getTypeFunction("Strażak");

        for (VehicleCrewRequest crew : request.getCrews()) {
            Garage garage = garageRepository.findById(crew.getVehicleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Nie znaleziono pojazdu."));
            VehicleToCard vehicleToCard = vehicleToCardRepository.save(
                    new VehicleToCard(card, garage)
            );

            if (crew.getDriverId() != null) {
                saveFirefighterRole(vehicleToCard, crew.getDriverId(), driverFunction);
            }

            if (crew.getCommanderId() != null) {
                saveFirefighterRole(vehicleToCard, crew.getCommanderId(), commanderFunction);
            }

            if (crew.getFirefighterIds() != null) {
                crew.getFirefighterIds().forEach(firefighterId
                        -> saveFirefighterRole(vehicleToCard, firefighterId, firefighterFunction)
                );
            }
        }
    }

    private TypeFunction getTypeFunction(String name) {
        return typeFunctionRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Nie znaleziono funkcji: " + name));
    }

    private void saveFirefighterRole(
            VehicleToCard vehicleToCard,
            Long firefighterId,
            TypeFunction typeFunction
    ) {
        Firefighter firefighter = firefighterRepository.findById(firefighterId)
                .orElseThrow(() -> new ResourceNotFoundException("Nie znaleziono strażaka."));

        firefighterActionRoleRepository.save(
                new FirefighterActionRole(vehicleToCard, typeFunction, firefighter)
        );
    }

    private Place getOrCreatePlace(City city, Street street, Firefighter createdBy) {
        if (street == null) {
            return placeRepository.findByCityAndStreetIsNull(city)
                    .orElseGet(() -> placeRepository.save(
                    new Place(city, null, createdBy)
            ));
        }

        return placeRepository.findByCityAndStreet(city, street)
                .orElseGet(() -> placeRepository.save(
                new Place(city, street, createdBy)
        ));
    }

    public List<DepartureCardHistoryResponse> getCardHistory() {
        List<Card> cards = cardRepository.findAllByOrderByDepartureDateDesc();

        return cards.stream().map(card -> {
            String cityName = card.getPlace().getCity().getName();

            String streetName = card.getPlace().getStreet() != null
                    ? card.getPlace().getStreet().getName()
                    : null;

            String placeName = streetName != null
                    ? cityName + ", " + streetName
                    : cityName;

            String incidentName = card.getIncident().getName();

            String commanderName = card.getCommander().getUser().getName()
                    + " "
                    + card.getCommander().getUser().getLastname();

            String typeCardName = card.getTypeCard().getName();

            return new DepartureCardHistoryResponse(
                    card.getId(),
                    card.getDepartureNumber(),
                    card.getDepartureDate(),
                    card.getDepartureTime(),
                    card.getReturnTime(),
                    placeName,
                    incidentName,
                    commanderName,
                    typeCardName
            );
        }).toList();
    }

    public DepartureCardDetailsResponse getCardDetails(Long cardId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new ResourceNotFoundException("Nie znaleziono karty wyjazdu."));

        String cityName = card.getPlace().getCity().getName();

        String streetName = card.getPlace().getStreet() != null
                ? card.getPlace().getStreet().getName()
                : null;

        String incidentName = card.getIncident().getName();

        String commanderName = card.getCommander().getUser().getName()
                + " "
                + card.getCommander().getUser().getLastname();

        String typeCardName = card.getTypeCard().getName();

        String createdByName = card.getCreatedBy().getUser().getName()
                + " "
                + card.getCreatedBy().getUser().getLastname();

        List<VehicleCrewResponse> vehicleCrews = vehicleToCardRepository
                .findByCardId(card.getId())
                .stream()
                .map(vehicleToCard -> {
                    List<CrewMemberResponse> crew = firefighterActionRoleRepository
                            .findByVehicleToCardId(vehicleToCard.getId())
                            .stream()
                            .map(role -> new CrewMemberResponse(
                            role.getFirefighter().getId(),
                            role.getFirefighter().getUser().getName()
                            + " "
                            + role.getFirefighter().getUser().getLastname(),
                            role.getTypeFunction().getName()
                    ))
                            .toList();

                    return new VehicleCrewResponse(
                            vehicleToCard.getId(),
                            vehicleToCard.getGarage().getId(),
                            vehicleToCard.getGarage().getCarOperationalNumber(),
                            crew
                    );
                })
                .toList();

        return new DepartureCardDetailsResponse(
                card.getId(),
                card.getDepartureNumber(),
                card.getDepartureDate(),
                card.getDepartureTime(),
                card.getReturnTime(),
                cityName,
                streetName,
                incidentName,
                typeCardName,
                commanderName,
                createdByName,
                vehicleCrews
        );
    }
}

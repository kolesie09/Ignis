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
import com.ignis.API.entity.IncidentType;
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
import com.ignis.API.repository.UserRepository;
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
    private final UserRepository userRepository;

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
            TypeCardRepository typeCardRepository,
            UserRepository userRepository
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
        this.userRepository = userRepository;
    }

    // Metoda do tworzenia karty wyjazdu
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
                createdBy,
                null,
                true
        );

        Card savedCard = cardRepository.save(card);

        saveCrews(request, savedCard);

        return new DepartureCardResponse(
                savedCard.getId(),
                savedCard.getDepartureNumber(),
                "Karta wyjazdu została zapisana."
        );
    }

    // Metoda pomocnicza do zapisywania załóg pojazdów i przypisywania ról strażakom
    private void saveCrews(DepartureCardRequest request, Card card) {
        if (request.getCrews() == null || request.getCrews().isEmpty()) {
            return;
        }

        TypeFunction driverFunction = getTypeFunction("Kierowca");
        TypeFunction commanderFunction = getTypeFunction("Dowódca");
        TypeFunction firefighterFunction = getTypeFunction("Strażak");

        // Zapisz powiązania pojazdów z kartą i przypisz role strażakom
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

    // Metoda pomocnicza do pobierania TypeFunction po nazwie
    private TypeFunction getTypeFunction(String name) {
        return typeFunctionRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Nie znaleziono funkcji: " + name));
    }

    // Metoda pomocnicza do zapisywania roli strażaka w akcji
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

    // Metoda pomocnicza do pobierania lub tworzenia miejsca
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

    // Metoda do pobierania historii kart wyjazdu
    public List<DepartureCardHistoryResponse> getCardHistory() {
        List<Card> cards = cardRepository.findByIsActiveTrueOrderByDepartureDateDescReturnTimeDescDepartureTimeDescDepartureNumberDesc();

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

    // Metoda do pobierania szczegółów karty wyjazdu
    public DepartureCardDetailsResponse getCardDetails(Long cardId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new ResourceNotFoundException("Nie znaleziono karty wyjazdu."));

        City city = card.getPlace().getCity();
        Street street = card.getPlace().getStreet();
        Incident incident = card.getIncident();
        IncidentType incidentType = incident.getIncidentType();
        String cityName = card.getPlace().getCity().getName();

        String streetName = card.getPlace().getStreet() != null
                ? card.getPlace().getStreet().getName()
                : null;

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
                city.getId(),
                cityName,
                street == null ? null : street.getId(),
                street == null ? null : street.getName(),
                incidentType.getId(),
                incidentType.getName(),
                incident.getId(),
                incident.getName(),
                typeCardName,
                commanderName,
                createdByName,
                vehicleCrews,
                card.getTrip()
        );
    }

    // Metoda do tworzenia rewizji karty wyjazdu
    public DepartureCardResponse createCardRevision(Long parentCardId, DepartureCardRequest request, String login) {

        Card parentCard = cardRepository.findById(parentCardId)
                .orElseThrow(() -> new ResourceNotFoundException("Nie znaleziono karty wyjazdu."));

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

        Place place = getOrCreatePlace(city, street, createdBy);

        Incident incident = incidentRepository.findById(request.getIncidentId())
                .orElseThrow(() -> new ResourceNotFoundException("Nie znaleziono powodu wyjazdu."));

        if (request.getCrews() == null || request.getCrews().isEmpty()) {
            throw new ResourceNotFoundException("Nie wskazano obsady pojazdu.");
        }
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

        EmailStatus emailStatus = emailStatusRepository.findByName("Nie wysłano")
                .orElseThrow(() -> new ResourceNotFoundException("Nie znaleziono statusu e-mail: Nie wysłano."));

        EmailSend emailSend = emailSendRepository.save(new EmailSend(emailStatus));

        parentCard.deactivate();
        cardRepository.save(parentCard);

        Integer departureNumber = request.getDepartureNumber() != null
                ? request.getDepartureNumber()
                : parentCard.getDepartureNumber();

        Card newCard = new Card(
                departureNumber,
                LocalDate.parse(request.getDate()),
                LocalTime.parse(request.getTimeDeparture()),
                LocalTime.parse(request.getTimeArrival()),
                request.getDistance(),
                place,
                incident,
                emailSend,
                commander,
                typeCard,
                createdBy,
                parentCard.getId(),
                true
        );

        Card savedCard = cardRepository.save(newCard);

        saveCrews(request, savedCard);

        return new DepartureCardResponse(savedCard.getId(), savedCard.getDepartureNumber(), "Rewizja karty wyjazdu została zapisana.");
    }
}

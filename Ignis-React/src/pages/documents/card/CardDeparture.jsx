import React, { useState, useMemo } from "react";
import { Card, CardBody } from "../../../components/Card";
import { rows } from "../../../data/mock.js";
import { useParams, Link } from "react-router-dom";

export default function CardDeparture() {
  const { id } = useParams();

  const znalezionyElement = rows.find((r) => r.id === id);

  // Sprawdźmy, czy działa:
  console.log("Moje ID to:", id);

  return (
    <div className="grid ">
      <Card>
        <CardBody className="overflow-x-auto p-0">
          {/* --- SEKCJA NAGŁÓWKA --- */}
          <div className="flex flex-col items-center p-6 border-b border-zinc-200 dark:border-zinc-700">
            {/* Mała pastylka z typem */}
            <span className="mb-2 px-3 py-1 text-xs font-medium uppercase tracking-wider text-blue-600 bg-blue-100 rounded-full dark:text-blue-200 dark:bg-blue-900">
              {znalezionyElement?.type}
            </span>

            {/* Główny tytuł */}
            <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white text-center">
              {znalezionyElement?.name}
            </h1>

            {/* Subtelne ID pod spodem */}
            <p className="mt-2 text-sm text-zinc-500">ID: #{id}</p>
          </div>
          {/* --- SEKCJA SZCZEGÓŁÓW (GRID) --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Lokalizacja */}
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Lokalizacja
              </p>
              <p className="text-lg font-medium text-zinc-900 dark:text-white">
                {znalezionyElement?.location}
              </p>
            </div>

            {/* Pojazd */}
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Pojazd</p>
              <p className="text-lg font-medium text-zinc-900 dark:text-white">
                {znalezionyElement?.vehicle}
              </p>
            </div>

            {/* Czas trwania */}
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Czas trwania
              </p>
              <p className="text-lg font-medium text-zinc-900 dark:text-white">
                {znalezionyElement?.duration}
              </p>
            </div>

            {/* Ostatnia modyfikacja */}
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Zmodyfikowano
              </p>
              <p className="text-lg font-medium text-zinc-900 dark:text-white">
                {znalezionyElement?.modified}
              </p>
            </div>
          </div>
          {/* --- SEKCJA ZESPÓŁ --- */}
          <div className="p-6 border-t border-zinc-200 dark:border-zinc-700">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
              Obsada ({znalezionyElement?.members?.length})
            </h2>

            <div className="space-y-2">
              {znalezionyElement?.members?.map((member, index) => (
                <Link
                  key={index}
                  to={"/documents/history/" + member.replaceAll(" ", "-")}
                  className="flex items-center p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg"
                >
                  {/* Awatar z pierwszą literą imienia */}
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-xs mr-3">
                    {member.charAt(0)}
                  </div>

                  {/* Imię i nazwisko */}

                  <span className="text-zinc-700 dark:text-zinc-200 font-medium">
                    {member}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

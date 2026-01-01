import React, { useState, useMemo } from "react";
import { Card, CardBody } from "../../components/Card";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { rows } from "../../data/mock.js";
import { MoreVertical } from "lucide-react";
import { AvatarStack } from "../../components/Avatar.jsx";

export default function History() {
  return (
    <div className="grid gap-4">
      <Card>
        <CardBody className="overflow-x-auto p-0">
          <h1 className="text-3xl font-semibold text-center p-5">
            Historia dokumentów
          </h1>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-zinc-500 dark:text-zinc-400">
                <th className="py-3 pl-5 pr-6">Nazwa</th>
                <th className="py-3 pr-6">Udostępnianie</th>
                <th className="py-3 pr-6">Czas</th>
                <th className="py-3 pr-6">Modyfikacja</th>
                <th className="py-3 pr-5 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr
                  key={r.id}
                  className={`border-t border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 ${
                    idx % 2 === 0
                      ? "bg-white dark:bg-zinc-900"
                      : "bg-white dark:bg-zinc-900"
                  }`}
                >
                  <td className="py-3 pl-5 pr-6">
                    <div className="flex flex-col">
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {r.name}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {r.location} • {r.type} • {r.vehicle}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 pr-6">
                    <AvatarStack names={r.members} />
                  </td>
                  <td className="py-3 pr-6">{r.duration}</td>
                  <td className="py-3 pr-6">{r.modified}</td>
                  <td className="py-3 pr-5 text-right">
                    <Menu as="div" className="relative inline-block text-left">
                      <MenuButton className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">
                        <MoreVertical className="h-4 w-4" />
                      </MenuButton>
                      <MenuItem className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-zinc-800">
                        <button className="bg-white data-[focus]:bg-blue-500">
                          Edytuj
                        </button>
                      </MenuItem>
                    </Menu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

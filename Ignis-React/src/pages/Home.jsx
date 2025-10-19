import { Card, CardBody } from "../components/Card.jsx";
import { Button } from "../components/Button.jsx";
import { Input } from "../components/Inputs.jsx";
import { quick, rows } from "../data/mock.js";
import {
  Folder,
  FileText,
  ChevronRight,
  MoreVertical,
  Plus,
} from "lucide-react";
import { AvatarStack } from "../components/Avatar.jsx";
import React from "react";

export default function Home({ setSelected, setOpenRight }) {
  return (
    <div className="grid gap-4">
      {/* Quick Access */}
      <Card>
        <CardBody className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Szybki dostęp
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quick.map((q) => (
              <div
                key={q.id}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 p-4 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  {q.icon === "file" ? (
                    <FileText className="h-6 w-6 text-indigo-600" />
                  ) : (
                    <Folder className="h-6 w-6 text-indigo-600" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {q.name}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {q.info}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Breadcrumbs + Add New */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <span className="text-zinc-700 dark:text-zinc-200">Home</span>
          <ChevronRight className="h-4 w-4" />
          <span>Wyjazdy</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-zinc-700 dark:text-zinc-200">2025</span>
        </div>
        <Button icon={Plus} variant="primary">
          Dodaj nowy
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardBody className="overflow-x-auto p-0">
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
                    <button
                      onClick={() => {
                        setSelected(r);
                        setOpenRight(true);
                      }}
                      className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
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

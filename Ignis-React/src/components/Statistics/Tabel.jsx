import { Card, CardBody } from "../Card";

export const RowInfo = ({ id, who, departure, hour }) => (
  <tr className=" border-b border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-400">
    <td className="text-center px-3 py-2 ">{id}</td>
    <td className="text-center px-3 py-2">{who}</td>
    <td className="text-center px-3 py-2">{departure}</td>
    <td className="text-center px-3 py-2 ">{hour}</td>
  </tr>
);

import {createPool} from "mysql2/promise";
import { config } from '../config/config.example';

export const pool = createPool({
  host: config.host,
  user: config.user,
  database: config.database,
  namedPlaceholders: true,
  decimalNumbers: true,
});
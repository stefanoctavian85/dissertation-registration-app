import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

export const Account = sequelize.define('Account', {
    id: { type: DataTypes.UUID, primaryKey: true},
    username: DataTypes.STRING,
    password: DataTypes.STRING,
});
import { Account } from "./Account.model.js";

export async function migrate() {
    await Account.sync();

    await Account.create({
        id: 'afe74414-beff-42b1-bce9-754ef3c886b0',
        username: "test",
        password: "test",
    });
}

export async function getAccountById(id) {
    const account = await Account.findByPk(id);
    return account?.dataValues;
}

export async function getAccountByUsername(username) {
    const account = await Account.findOne({ where: {username}});
    return account?.dataValues;
}
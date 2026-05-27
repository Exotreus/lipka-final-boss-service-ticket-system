export class Ticket {
    constructor(id, fullName, email, category, description, createTime) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.category = category;
        this.description = description;
        this.createTime = createTime;
    }
}

export const Categories = Object.freeze({
    MISC: "Misc",
    HARDWARE: "Hardware",
    SOFTWARE: "Software",
    NETWORK: "Network"
});
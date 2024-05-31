// singleton database file to share across the application

import { Storage } from "@ionic/storage";

const storage = new Storage();

storage.create();

export default storage;
import EncryptedStorage from "react-native-encrypted-storage";

export const insert = async (key, value) => {
	try {
		await EncryptedStorage.setItem(key, value);
	} catch (e) {
		alert("Error while saving " + key + "." + e);
	}
};

export const select = async (key) => {
	try {
		var data = await EncryptedStorage.getItem(key);
		return data;
	} catch(e) {
		alert("Error getting " + key + "." + e);
	}
};

export const remove = async (key) => {
	try {
		await EncryptedStorage.removeItem(key);
	} catch(e) {
		alert("Error while removing " + key + "." + e);
	}
};

export const clear = async () => {
	try {
		await EncryptedStorage.clear();
	} catch (e) {
		alert("Error while clearing encrypted storage");
	}
};

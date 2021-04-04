import AsyncStorage from '@react-native-async-storage/async-storage';

export const insert = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value)
    } catch (e) {
        alert("Error while saving " + key + "." + e);
    }
}

export const select = async (key) => {
    try {
    var data = await AsyncStorage.getItem(key);
    return data;
    } catch(e) {
        alert("Error getting " + key + "." + e);
    }
}

export const remove = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch(e) {
      alert("Error while removing " + key + "." + e);
    }
}

export const getAllKeys = async () => {
    try {
      var data = await AsyncStorage.getAllKeys();
      return data;
    } catch(e) {
        alert("Error while reading keys: " + e);
    }
}

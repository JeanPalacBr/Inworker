import firebase from 'firebase';
import { saveToken, saveUserid, getUserid, saveUserInfo } from "./storage";
import { UserModel } from '../models';
import { mapResponse } from '../utils/mapResponse';

const apiKey = process.env.REACT_APP_APIKEY
export const login = async (email, password) => {
    try {
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`
        const body = JSON.stringify({ email, password, returnSecureToken: true });
        const jsonResponse = await fetch(url, { method: 'POST', body })
        const response = await jsonResponse.json()
        if (response.idToken) {
            return { success: true, res: response }
        } else {
            return { success: false, res: traslateFirebaseMessageError(response.error.message) }

        }
    } catch (error) {
        return { success: false, res: error.message }
    }
}
export const signup = async (email, password) => {
    try {
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`
        const body = JSON.stringify({ email, password, returnSecureToken: true });
        const jsonResponse = await fetch(url, { method: 'POST', body })
        const response = await jsonResponse.json()
        if (response.idToken) {
            return { success: true, res: response }
        } else {
            return { success: false, res: traslateFirebaseMessageError(response.error.message) }

        }
    } catch (error) {
        return { success: false, res: error.message }
    }
}
export const changeEmail = async ({ email, id }) => {
    try {
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${apiKey}`
        const body = JSON.stringify({ email, returnSecureToken: true, idToken: id });
        const jsonResponse = await fetch(url, { method: 'POST', body })
        const response = await jsonResponse.json()
        console.log('change email', response)
        if (response.idToken) {
            return { success: true, res: response }
        } else {
            return { success: false, res: traslateFirebaseMessageError(response.error.message) }

        }
    } catch (error) {
        return { success: false, res: error.message }
    }
}
export const signout = () => {
    saveUserid('')
    saveUserInfo({})
    return saveToken('');
}
export const passwordRecovery = async (email) => {
    try {
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`
        const body = JSON.stringify({ email, requestType: "PASSWORD_RESET" });
        const jsonResponse = await fetch(url, { method: 'POST', body })
        const response = await jsonResponse.json()
        if (response.email) {
            return { success: true, res: response }
        } else {
            return { success: false, res: traslateFirebaseMessageError(response.error.message) }

        }
    } catch (error) {
        return { success: false, res: error.message }
    }
}

export function traslateFirebaseMessageError(errorMessage) {
    switch (errorMessage) {
        case 'EMAIL_NOT_FOUND':
            return 'El correo ingresado no existe';
        case 'INVALID_PASSWORD':
            return 'Contraseña incorrecta, intenta nuevamente'
        default:
            return errorMessage;
    }
}


/**
     * 
     * @param {UserModel} usuario 
     */

export async function createUser(usuario) {
    try {
        const response = await firebase.firestore().collection('usuarios').add({
            ...usuario
        })
        console.log("create user response", response);
        return mapResponse(true, response);
    } catch (error) {
        return mapResponse(false, error.message);
    }
}

export async function updateUser({ name, avatar, email }) {

    try {
        saveUserInfo({ avatar, email })
        const usersCol = firebase.firestore().collection('usuarios');
        const userCollection = usersCol.doc(getUserid())
        const _users = await userCollection.set({ avatar }, { merge: true })
        return { success: true, res: _users };
    } catch (error) {
        console.log('error get users', error.message);
        return { success: false, res: error.message };
    }
}

/**
 * @returns {{res:[{email:String,id:String}],success:Boolean}}}
 */
export async function getUsers() {
    try {
        const userCollection = firebase.firestore().collection('usuarios')
        const _users = await userCollection.get()
        const users = [];
        _users.forEach(doc => {
            const docData = doc.data()
            users.push({ email: docData.email, id: docData.id, name: docData.name })

        })
        console.log(users);
        return { success: true, res: users };


    } catch (error) {
        console.log('error get users', error.message);
        return { success: false, res: error.message };
    }

}


export async function getUser() {
    try {
        const id = getUserid()
        const userCollection = await firebase.firestore().collection('usuarios').where("id", "==", id).get()
        const userData = userCollection.docs[0].data()
        const userModel = new UserModel({ ...userData })
        saveUserInfo(userModel)
        return mapResponse(true, userModel)
    }
    catch (error) {
        console.log('error get users', error.message);
        return { success: false, res: error.message };
    }
}


export async function getUserById(id) {
    try {
        const userDocument = await  firebase.firestore().collection('usuarios').where("id", "==", id).get()
        const doc =  await userDocument.docs[0].ref.get()
        return { success: true, res: doc.data() };

    } catch (error) {
        console.log('error get users', error.message);
        return { success: false, res: error.message };
    }

}
export async function updateUserById(id, { name }) {
    try {
        const userDocument = await  firebase.firestore().collection('usuarios').where("id", "==", id).get()
        const docId =  await userDocument.docs[0].ref.update({ name })
        console.log(docId);
        return { success: true, res: docId };

    } catch (error) {
        console.log('error get users', error.message);
        return { success: false, res: error.message };
    }

}
export async function deleteUserById(id) {
    try {
        const userDocument = await  firebase.firestore().collection('usuarios').where("id", "==", id).get()
        const docId =  await userDocument.docs[0].ref.delete()
        console.log(docId);
        return { success: true, res: docId };

    } catch (error) {
        console.log('error get users', error.message);
        return { success: false, res: error.message };
    }

}


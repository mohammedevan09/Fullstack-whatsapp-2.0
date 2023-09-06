import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyAauiEUjg3PU4H62c0dMUfQost-qWg2VzE',
  authDomain: 'whatsapp-clone-3dcba.firebaseapp.com',
  projectId: 'whatsapp-clone-3dcba',
  storageBucket: 'whatsapp-clone-3dcba.appspot.com',
  messagingSenderId: '1005646429792',
  appId: '1:1005646429792:web:b59785405482f453ae0d05',
  measurementId: 'G-XJNBYJ16T5',
}

const app = initializeApp(firebaseConfig)
export const firebaseAuth = getAuth(app)

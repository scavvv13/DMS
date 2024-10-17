// firebase.js
const admin = require("firebase-admin");
const { initializeApp } = require("firebase-admin/app");
const { getStorage } = require("firebase-admin/storage");

const serviceAccount = {
  // Your Firebase service account credentials
  apiKey: "AIzaSyC014p1B90pM8fER-2dseL2Eu1EIy4t2iI",
  authDomain: "document-management-syst-52f3d.firebaseapp.com",
  projectId: "document-management-syst-52f3d",
  storageBucket: "document-management-syst-52f3d.appspot.com",
  messagingSenderId: "171966659817",
  appId: "1:171966659817:web:8225d43d6b8b2e13ac0478",
  measurementId: "G-ZYRL4B9S10",
  type: "service_account",
  project_id: "document-management-syst-52f3d",
  private_key_id: "fafab809878a18a045ee771634d855dfe79d0284",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCovgQp67YM+dWT\n+DNVD3AlMqrlEIop4Z1ke5cXRIW9ds7ZFrnONdHXauzvZtlE8fsePj7xb4orcPkU\n9HSMec5695LgwLBMrCYPmY2MBMzYs6p/YKVUdm6mt6cvROw3HZgXPZVpqwn1HN9i\nXkUQnPlJHHvJkghPPg5nbzA56/A1YBK3W44zdjUpjRLcmgDaIYgWm+qaWErzwlF7\n5koLzt07FG3nN6TlE56leQuwQlTrRTo+zTdYTfmSWWR3yuW3M80+dYIm/WSIceQI\n/fx391BW/6SEnou/C0jV191uQjjzMROHOxr6iQ5QvxdXmRWFoGI3CE0gbCGuk0YW\nXC2a7FXBAgMBAAECggEAGOt69O/tAkyRGJmihxDRGIU7jLmdFeNOWa0Q2qxRbfIS\nSSgch5IWK9CMLizLsG1mDwjVRdWZm6HC/y+82JQShMF0LQH351LTCiG8sC1zTRt3\ndflBYVBeNfvQUmBE3DzgHaqIGsNaJJs/eCkA3Ru5iu0McO/Cj2VUPj1C64LnBhKs\nycEg4w3zhj+JrwA1KUoppXWLj+HTJsyrblhLxSikJoAc6XSX+CQd6exdH76za+3u\nntkQOsxTwsJ2Ikf+u9V6JqksO/MFVL6CnkjoUfBpIx/Bz+MjZsQ1mts1rcc60Uvy\n1zXYKkZ9PXNQU148OyzoOt/nrdhQCOnS/VmZFs+6gwKBgQC4HTdUXrb1b/c8oaBm\njI8HMP8RnitsgdTlBXQ+5oxnSrrzsZP4PnM/zhHQepbVF1O8qeQrXzFpwWUNrD/w\nzpy37XfF2tA9ga3hZdTP1D99YSRDh1/oult9C+ElKGTmJ1u3fyXkLfCaD0DO+Hug\nb+SPqtnKPAkYZj71nPiGnxV16wKBgQDqoFVGPqHY5NEZyJs//P7wQ1Wkgmn36dhP\naBOxJjo2liIvZ/Kk3kaYr/VZEbp+BpzmoptVYGYXn5eX9mAzAV5cXyWSlQOUCN9n\nPy1/CVj4kmgEaLojosO0D6pX6hxP/eWfcwsWPFFeSlbqz84oEFIn2xfDNn0y6NId\na5s2gYLcAwKBgAO9PClvfwG/E2Nc2PgcNK9ttFB0SOd8P4mjMbgxUHqsjt1yJtIs\n2oRaOAxm4PdU8PNs8+BZn5RJRDch326Rk6c8oGkZR49oOdLREaBi7CMsvOLONglw\n93izrA/oIRx3gipY37khobhPRP6vFzur6hVs3912mKyxLugoFvgM9Q+fAoGBALSS\nLM7hCSKqB5u2XnWCupoi2FjB3dhk6otCaFVgPFEifrDJaV8limOcmFCyajrvz/VY\nk//DLw9jTgIwJZ1bokmpGHuVn6lgor8NSnCIuyajVtZ92zPt4nxDyi/bB2sw1nY+\nzfuQ9HaC9B3HTLxcwz3VSpZ86yIxOPRXip8KUbINAoGAHP3d/wKGBI36LGQSlfst\nTPKyGmaDxOCVXSfDWZ4N6CqpWGLmyFPhFGMDiDJZ27wk/Z+7e5Fi5miNaDmirMdW\nlOYfpT4OFYu6SeVFZZjtLza56dqYOrndpmQiJnsVN1o6rVJFa+Z0pKXmKwkU1txO\nEeaUvYAgo1qyAfxar0uxHNw=\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-55pfl@document-management-syst-52f3d.iam.gserviceaccount.com",
  client_id: "108148242201407549538",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-55pfl%40document-management-syst-52f3d.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "document-management-syst-52f3d.appspot.com", // Your storage bucket
});

const bucket = getStorage().bucket();

module.exports = bucket;

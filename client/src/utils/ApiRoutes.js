export const HOST = process.env.NEXT_PUBLIC_HOST

const AUTH_ROUTE = `${HOST}/api/auth`
const MESSAGES_ROUTE = `${HOST}/api/messages`

// auth
export const CHECK_USER_ROUTE = `${AUTH_ROUTE}/check-user`
export const ONBOARD_USER_ROUTE = `${AUTH_ROUTE}/onboard-user`
export const GET_ALL_USERS = `${AUTH_ROUTE}/getAllUsers`
export const GET_CALL_TOKEN = `${AUTH_ROUTE}/generate-token`

// messages
export const ADD_MESSAGE_ROUTE = `${MESSAGES_ROUTE}/add-message`
export const GET_MESSAGES_ROUTE = `${MESSAGES_ROUTE}/get-messages`
export const ADD_IMAGE_MESSAGE_ROUTE = `${MESSAGES_ROUTE}/add-image-message`
export const GET_INITIAL_CONTACTS_ROUTE = `${MESSAGES_ROUTE}/get-initial-contacts`

import { tripActionTypes } from './trip.actionTypes';

export const setTrips = (trips) => ({
  type: tripActionTypes.SET_TRIPS,
  payload: trips,
});
export const setFoundTrip = (trip) => ({
  type: tripActionTypes.SET_FOUND_TRIP,
  payload: trip,
});

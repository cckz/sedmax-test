import { UPDATE_SELECTED, UPDATE_DATA } from '../constants'

export function updateSelected(selected) {
    return {
        type: UPDATE_SELECTED,
        payload: {selected}
    }
}

export function updateData(data) {
    return {
        type: UPDATE_DATA,
        payload: {data}
    }
}
import { randomData } from '../fixtures'
import { UPDATE_SELECTED, UPDATE_DATA } from '../constants'

const initState = {
  data: randomData,
  selected: [],
};

export default (state = initState, action) => {
    const {type, payload} = action;    
    switch (type) {
        case UPDATE_SELECTED:
            return {...state, selected: payload.selected};
        case UPDATE_DATA:
            const rewriteData = state.data.map(itemState => {
                const findIdInDataCache = payload.data.find(itemDataCahce => itemDataCahce.id === itemState.id);
                return findIdInDataCache ? itemState = findIdInDataCache : itemState
            })
            return {...state, data: rewriteData};
        default:
            return state
    }
}
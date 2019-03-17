import {OPEN_SECTION_INFO, TOGGLE_SEARCH_FILTER, UPDATE_SEARCH, UPDATE_SECTIONS} from "../actions";
import {sections_data_a} from "../sections_data";

const initialState = {
    sections: sections_data_a,
    searchResults: [],
    sectionInfo: undefined,
    showSearchFilter: false,
    searchFilterLocation: undefined
};

export const sections = (state = initialState, action) => {
    switch (action.type) {
        case OPEN_SECTION_INFO:
            return {
                ...state,
                sectionInfo: action.sectionInfo
            };
        case UPDATE_SECTIONS:
            return {
                ...state,
                sections: action.sections
            };
        case UPDATE_SEARCH:
            return {
                ...state,
                searchResults: action.searchResults,
                sections: undefined
            };
        case TOGGLE_SEARCH_FILTER:
            return {
                ...state,
                showSearchFilter : ! state.showSearchFilter,
                showSearchFilterLocation :  action.location
            };
        default:
            return {
                ...state,
            };
    }
};
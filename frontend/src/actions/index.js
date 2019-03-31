export const ADD_SCHED_ITEM = "ADD_SCHED_ITEM";
export const REMOVE_SCHED_ITEM = "REMOVE_SCHED_ITEM";
export const UPDATE_SEARCH = "UPDATE_SEARCH";
export const OPEN_SECTION_INFO = "OPEN_SECTION_INFO";
export const CHANGE_SCHEDULE = "CHANGE_SCHEDULE";
export const CREATE_SCHEDULE = "CREATE_SCHEDULE";
export const UPDATE_SECTIONS = "UPDATE_SECTIONS";
export const TOGGLE_SEARCH_FILTER = "TOGGLE_SEARCH_FILTER";
export const OPEN_MODAL = "OPEN_MODAL";
export const CLOSE_MODAL = "CLOSE_MODAL";
export const ACTION_BUTTON_PRESSED = "ACTION_BUTTON_PRESSED";
export const DELETE_SCHEDULE = "DELETE_SCHEDULE";
export const RENAME_SCHEDULE = "RENAME_SCHEDULE";
export const DUPLICATE_SCHEDULE = "DUPLICATE_SCHEDULE";
export const CLEAR_SCHEDULE = "CLEAR_SCHEDULE";
export const COURSE_SEARCH_ERROR = "COURSE_SEARCH_ERROR";
export const COURSE_SEARCH_LOADING = "COURSE_SEARCH_LOADING";
export const COURSE_SEARCH_SUCCESS = "COURSE_SEARCH_SUCCESS";

export const duplicateSchedule = scheduleName => (
    {
        type: DUPLICATE_SCHEDULE,
        scheduleName
    }
);

export const deleteSchedule = () => (
    {
        type: DELETE_SCHEDULE,
    }
);

export const renameSchedule = scheduleName => (
    {
        type: RENAME_SCHEDULE,
        scheduleName
    }
);

export const changeSchedule = scheduleId => (
    {
        type: CHANGE_SCHEDULE,
        scheduleId
    }
);

export const addSchedItem = courseObj => (
    {
        type: ADD_SCHED_ITEM,
        courseObj
    }
);

export const removeSchedItem = idDashed => (
    {
        type: REMOVE_SCHED_ITEM,
        idDashed
    }
);

export const updateSearch = searchResults => (
    {
        type: UPDATE_SEARCH,
        searchResults
    }
);

export const updateSections = sections => (
    {
        type: UPDATE_SECTIONS,
        sections
    }
);

export const updateSectionInfo = sectionInfo => (
    {
        type: OPEN_SECTION_INFO,
        sectionInfo
    }
);

export const createSchedule = scheduleName => (
    {
        type: CREATE_SCHEDULE,
        scheduleName
    }
);

export const toggleSearchFilterShown = location => (
    {
        type: TOGGLE_SEARCH_FILTER,
        location
    }
);


export const openModal = modalShown => (
    {
        type: OPEN_MODAL,
        modalShown
    }
);


export const closeModal = () => (
    {
        type: CLOSE_MODAL,
    }
);

export const triggerModalAction = (modalAction) => (
    {
        type: ACTION_BUTTON_PRESSED,
        modalAction
    }
);

export const clearSchedule = () => (
    {
        type: CLEAR_SCHEDULE
    }
);

export function courseSearchError(bool) {
    return {
        type: COURSE_SEARCH_ERROR,
        hasErrored: bool
    };
}
export function courseSearchLoading(bool) {
    return {
        type: COURSE_SEARCH_LOADING,
        isLoading: bool
    };
}
export function courseSearchSuccess(items) {
    return {
        type: COURSE_SEARCH_SUCCESS,
        items
    };
}
import React from "react";
import PropTypes from "prop-types";

export const MaterialTailwind = React.createContext(null);
MaterialTailwind.displayName = "MaterialTailwindContext";

export function reducer(state, action) {
  switch (action.type) {
    case "OPEN_GLOBAL_NOTIF": {
      return { ...state, openNotif: action.value };
    }
    case "GLOBAL_NOTIF_CONTENT": {
      return { ...state, notifContent: action.value };
    }
    case "OPEN_SIDENAV": {
      return { ...state, openSidenav: action.value };
    }
    case "SIDENAV_TYPE": {
      return { ...state, sidenavType: action.value };
    }
    case "SIDENAV_COLOR": {
      return { ...state, sidenavColor: action.value };
    }
    case "TRANSPARENT_NAVBAR": {
      return { ...state, transparentNavbar: action.value };
    }
    case "FIXED_NAVBAR": {
      return { ...state, fixedNavbar: action.value };
    }
    case "OPEN_CONFIGURATOR": {
      return { ...state, openConfigurator: action.value };
    }
    case "OPEN_CLIENT_ADD_MODAL": {
      return { ...state, openClientForm: action.value };
    }
    case "OPEN_PATIENT_ADD_MODAL": {
      return { ...state, openPatientForm: action.value };
    }
    case "OPEN_ADD_SCHEDULE_MODAL": {
      return { ...state, openScheduleForm: action.value };
    }
    case "OPEN_UPDATE_SCHEDULE_MODAL": {
      return { ...state, openUpdateScheduleForm: action.value };
    }
    case "EVIDENCE_DIALOG": {
      return { ...state, evidenceContent: action.value };
    }
    case "CALL_DIALOG": {
      return { ...state, attContent: action.value };
    }
    case "BOOKING_DIALOG": {
      return { ...state, bookingContent: action.value };
    }
    case "PRODUCT_DIALOG": {
      return { ...state, productModal: action.value };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export function MaterialTailwindControllerProvider({ children }) {
  const initialState = {
    openSidenav: false,
    sidenavColor: "blue",
    sidenavType: "dark",
    transparentNavbar: true,
    fixedNavbar: false,
    openConfigurator: false,
    openClientForm: false,
    openPatientForm: false,
    openScheduleForm: false,
    openUpdateScheduleForm: false,
    openNotif: false,
    notifContent: {
      type: "error", //error or success
      color: "red",
      header: "Error",
      title: "Title",
      message: "Error Message",
    },
    evidenceContent: {
      show: false,
      imageUrl: ''
    },
    attContent: {
      show: false,
      store: {},
      callDetails: {
        startCall: "",
        endCall: "",
        geoLocation: {
            timeIn:"",
            timeOut:"",
            coorIn: {},
            coorOut: {}
        }
      }
    },
    bookingContent: {
      show: false,
      list: []
    },

    // Product
    productModal: false
  };

  const [controller, dispatch] = React.useReducer(reducer, initialState);
  const value = React.useMemo(
    () => [controller, dispatch],
    [controller, dispatch]
  );

  return (
    <MaterialTailwind.Provider value={value}>
      {children}
    </MaterialTailwind.Provider>
  );
}

export function useMaterialTailwindController() {
  const context = React.useContext(MaterialTailwind);

  if (!context) {
    throw new Error(
      "useMaterialTailwindController should be used inside the MaterialTailwindControllerProvider."
    );
  }

  return context;
}

MaterialTailwindControllerProvider.displayName = "/src/context/index.jsx";

MaterialTailwindControllerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const setOpenSidenav = (dispatch, value) =>
  dispatch({ type: "OPEN_SIDENAV", value });
export const setSidenavType = (dispatch, value) =>
  dispatch({ type: "SIDENAV_TYPE", value });
export const setSidenavColor = (dispatch, value) =>
  dispatch({ type: "SIDENAV_COLOR", value });
export const setTransparentNavbar = (dispatch, value) =>
  dispatch({ type: "TRANSPARENT_NAVBAR", value });
export const setFixedNavbar = (dispatch, value) =>
  dispatch({ type: "FIXED_NAVBAR", value });
export const setOpenConfigurator = (dispatch, value) =>
  dispatch({ type: "OPEN_CONFIGURATOR", value });
export const setOpenClientForm = (dispatch, value) =>
  dispatch({ type: "OPEN_CLIENT_ADD_MODAL", value });
export const setOpenPatientForm = (dispatch, value) =>
  dispatch({ type: "OPEN_PATIENT_ADD_MODAL", value });
export const setOpenScheduleForm = (dispatch, value) =>
  dispatch({ type: "OPEN_ADD_SCHEDULE_MODAL", value });
export const setOpenUpdateScheduleForm = (dispatch, value) =>
  dispatch({ type: "OPEN_UPDATE_SCHEDULE_MODAL", value });
export const setOpenNotif = (dispatch, value) =>
  dispatch({ type: "OPEN_GLOBAL_NOTIF", value });
export const setNotifContent = (dispatch, value) =>
  dispatch({ type: "GLOBAL_NOTIF_CONTENT", value });
export const setEvidenceContent = (dispatch, value) =>
  dispatch({ type: "EVIDENCE_DIALOG", value });
export const setCallContent = (dispatch, value) =>
  dispatch({ type: "CALL_DIALOG", value });
export const setBookingContent = (dispatch, value) =>
  dispatch({ type: "BOOKING_DIALOG", value });
export const setProductDialog = (dispatch, value) =>
  dispatch({ type: "PRODUCT_DIALOG", value });
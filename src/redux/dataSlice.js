import {createSlice} from "@reduxjs/toolkit"
import {useSelector} from "react-redux";


export const useRefreshView= () =>
    useSelector(state => state.ourData.refreshView);
const dataSlice = createSlice({
    name: "data",
    initialState: {
        isAuthenticated: false,
        isStaff: false,

        Soft: {},     // Soft objects stored there
        Sorted: [],   // Sorted keys are stored here
        Basket: {},   // Here stored only ids of soft objects,
        Payments: {}, // There are stored payments objects which contain soft inside key soft

        DraftId: 0,
        CurrentSoft: {},  // Used during some redirects
        refreshView: false,
    },
    reducers: {
        setIsAuthenticated(state, {payload}){
            state.isAuthenticated = payload;
        },
        setIsStaff(state, {payload}){
            state.isStaff = payload;
        },

        storeSoft(state, {payload}) {
            state.Soft = {};
            payload.forEach(soft => {
                state.Soft[soft.id] = soft;
            })
        },

        storeBasket(state, {payload}) {
            state.Basket = payload;
        },
        clearBasket(state) {
            state.Basket = {};
        },

        storePayments(state, {payload}) {
            state.Payments = {};
            payload.forEach(payment => {
                state.Payments[payment.id] = payment;
            })
        },
        addPayment(state, {payload}) {
            state.Payments = {...state.Payments, [payload.id]: payload,};
        },
        deletePaymentByID(state, {payload}) {
            const {[payload]: value, ...newPayments} = state.Payments;
            state.Payments = newPayments;
        },
        clearPayments(state) {
            state.Payments = {};
        },


        setCurrentSoft(state, {payload}) {
            state.CurrentSoft = payload;
        },
        clearCurrentSoft(state) {
            state.CurrentSoft = {};
        },


        setDraftId(state, {payload}) {
            state.DraftId = payload;
        },


        setRefreshView(state, {payload}){
            state.refreshView = payload;
        },

    }
})
export const useIsAuthenticated = () =>
    useSelector(state => state.ourData.isAuthenticated)

export const useIsStaff = () =>
    useSelector(state => state.ourData.isStaff)

export const useStoredSoft = () =>
    useSelector(state => state.ourData.Soft);

export const useBasket = () =>
    useSelector(state => state.ourData.Basket);

export const useStoredPayments = () =>
    useSelector(state => state.ourData.Payments);

export const useSum = () => {
    const basket =  useSelector(state => state.ourData.Basket)
    return basket.soft ? basket.soft.reduce((acc, obj) => acc + obj.price, 0) : 0
}

export const useIsInBasketByID = id => {
    const basket =  useSelector(state => state.ourData.Basket)
    return basket.soft ? basket.soft.some(soft => soft.id === id) : false
}

export const useIsRequestedByID = (id) =>
    Object.values(useSelector((state) => state.ourData.Payments)).some(
        payment =>
            payment.soft && payment.status !== 'rejected' &&
            payment.soft.includes(id)
    );

export const useIsSoftAviableByID = id =>
    Object.values(useSelector(state => state.ourData.Payments))
        .some(
            payment => payment.soft && payment.soft.includes(id) &&
                payment.status === 'completed'
        );

export const useCurrentSoft = () =>
    useSelector(state => state.ourData.CurrentSoft);


export const useDraftId = () =>
    useSelector(state => state.ourData.DraftId);


export const {
    setIsAuthenticated,
    setIsStaff,

    storeSoft,

    storeBasket,
    clearBasket,

    storePayments,
    addPayment,
    deletePaymentByID,
    clearPayments,

    setCurrentSoft,
    clearCurrentSoft,

    setDraftId,

    setRefreshView

} = dataSlice.actions


export default dataSlice.reducer

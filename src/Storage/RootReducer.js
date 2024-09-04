
var initialstate={
    orderData:{}
}

export default function RootReducer(state=initialstate,action)
{
    switch(action.type){

        case "ADD_ORDER":
        state.orderData[action.payload[0]]= action.payload[1]
        return{orderData:state.orderData}
        break;

        case "DELETE_ORDER":
        delete state.orderData[action.payload[0]]
        return{orderData:state.orderData}
        break;

        case "EDIT_ORDER":
        state.orderData[action.payload[0]]= action.payload[1]
        return{orderData:state.orderData}
        break;

        default:
            return {orderData:state.orderData}
    }

}
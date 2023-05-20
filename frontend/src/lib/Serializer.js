const serialize = (res) => {

    const response = {
        data: res?.data,
        status: res?.status || 0,
    };

    return response
};

export default serialize;
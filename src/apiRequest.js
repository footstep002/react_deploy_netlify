const apiRequest = async (
    url='', optionsObj = null, errMsg = null) => {
        try { // 결국 optionsObj에 따라 생성, 갱신, 삭제의 차이를 만들게 된다.
            const response = await fetch(url, optionsObj);
            if (!response.ok) {
                throw Error('Please reload the app');
            }
        } catch (err) {
            errMsg = err.message;
        } finally {
            // 에러가 없어 errMsg값으로 null을 반환하던지
            // 에러가 있어 해당 에러 메시지 값을 반환하던지
            // 어쨌든 반환은 하게끔 모든 경우에 여기를 거친다.
            return errMsg;
        }
}

export default apiRequest;
export default {
  name: '강남간호방문요양센터',
  phone: '', address: '', hours: '', businessNumber: '', representative: '', serviceArea: '',
  // address는 도로명주소입니다. 확인된 내용만 입력하세요.
  addressDetail: '', naverMapUrl: '', kakaoMapUrl: '',
  publicTransport: '', parking: '',
  // 실제 상담 API와 개인정보 처리 방침을 검토한 뒤 연결합니다.
  // API는 성공 시 { accepted: true, receiptId: '서버에서 발급한 접수 번호' }를 반환해야 합니다.
  contactEndpoint: '',
  privacyOfficer: '', verifiedOn: '2026-09-09',
};

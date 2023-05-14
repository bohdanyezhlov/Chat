import Spinner from 'react-bootstrap/Spinner';

const Loading = () => (
  <div className="d-flex justify-content-center mt-5 h-100 align-items-center">
    <Spinner animation="border" variant="primary" />
  </div>
);

export default Loading;

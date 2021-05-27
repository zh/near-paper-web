import {
  ModalContent,
  ModalFooter,
  ModalButton,
  useDialog,
} from 'react-st-modal';
import QRCode from 'qrcode.react';
import './QRCodeModal.css';

const QRCodeModal = (props) => {
  const { publicURL, privateURL } = props;
  const dialog = useDialog();

  return (
    <>
      <ModalContent className="printme">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ color: 'green' }}>Public</h3>
            <QRCode value={publicURL} />
          </div>
          <div>
            <h3 style={{ color: 'red' }}>Secret</h3>
            <QRCode value={privateURL} />
          </div>
        </div>
      </ModalContent>
      <ModalFooter className="no-printme">
        <ModalButton onClick={() => window.print()}>Print</ModalButton>
        <ModalButton
          type="dark"
          onClick={() => {
            dialog.close();
          }}
        >
          Close
        </ModalButton>
      </ModalFooter>
    </>
  );
};

export default QRCodeModal;

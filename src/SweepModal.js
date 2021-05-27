import { useState } from 'react';
import {
  ModalContent,
  ModalFooter,
  ModalButton,
  useDialog,
} from 'react-st-modal';

const SweepModal = (props) => {
  const { receiver } = props;
  const dialog = useDialog();
  const [value, setValue] = useState(receiver);

  return (
    <>
      <ModalContent className="printme">
        Receiver (*.testnet):{' '}
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
      </ModalContent>
      <ModalFooter className="no-printme">
        <ModalButton
          onClick={() => {
            dialog.close(value);
          }}
        >
          Confirm
        </ModalButton>
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

export default SweepModal;

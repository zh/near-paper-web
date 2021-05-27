import { useState } from 'react';
import {
  ModalContent,
  ModalFooter,
  ModalButton,
  useDialog,
} from 'react-st-modal';

const CreateModal = () => {
  const dialog = useDialog();
  const [value, setValue] = useState();

  return (
    <>
      <ModalContent className="printme">
        Amount(NEAR):{' '}
        <input
          type="text"
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
          Create
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

export default CreateModal;

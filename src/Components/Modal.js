import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

export default function AppModal({
  modal,
  toggle,
  className,
  title,
  body,
  showFooter,
  action,
}) {
  return (
    <Modal isOpen={modal} toggle={toggle} className={className}>
      <ModalHeader toggle={toggle}>{title}</ModalHeader>
      <ModalBody>{body}</ModalBody>
      {showFooter && (
        <ModalFooter>
          <Button color="danger" onClick={toggle}>
            {action}
          </Button>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      )}
    </Modal>
  );
}

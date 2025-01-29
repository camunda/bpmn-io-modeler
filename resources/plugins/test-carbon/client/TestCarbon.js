/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import React, { useEffect } from 'camunda-modeler-plugin-helpers/react';

import { Fill, Modal } from 'camunda-modeler-plugin-helpers/components';

import { Button } from '@carbon/react';

import './TestCarbon.scss';

export function TestCarbon() {

  const [ modalOpen, setModalOpen ] = React.useState(false);

  useEffect(() => {
    console.log('[TestCarbon] mounted');
  }, []);

  const close = () => {
    setModalOpen(false);
  };

  return <React.Fragment>
    { modalOpen && <CarbonModal onClose={ close } /> }
    <Fill slot="status-bar__app" group="1_first">
      <button
        className="btn"
        type="button"
        onClick={ () => setModalOpen(true) }
      >
        Carbon
      </button>
    </Fill>
  </React.Fragment>;
}

function CarbonModal({ onClose }) {

  return <Modal>
    <Modal.Title>Test Carbon</Modal.Title>
    <Modal.Body>
      <h1>Carbon</h1>
      <p>
        This is a Carbon modal.
      </p>
      <p className="color">This is supposed to be colorful</p>
      <p className="theme">This is supposed to be themed</p>
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={ onClose }>OK</Button>
    </Modal.Footer>
  </Modal>;
}
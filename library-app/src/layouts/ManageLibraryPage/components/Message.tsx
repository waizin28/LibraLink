import React, { useState } from 'react';
import MessageModel from '../../../models/MessageModel';

const Message: React.FC<{
  message: MessageModel;
  submitResponseToQuestion: any;
}> = (props) => {
  const [displayWarning, setDisplayWarning] = useState(false);
  const [response, setResponse] = useState('');

  function submitBtn() {
    if (props.message.id !== null && response !== '') {
      // pass in the response from admin, id already comes from the id of user's question
      props.submitResponseToQuestion(props.message.id, response);
      setDisplayWarning(false);
    } else {
      setDisplayWarning(true);
    }
  }

  return (
    <div key={props.message.id}>
      <div className='card mt-2 shadow p-3 bg-body rounded'>
        <h5>
          Case #{props.message.id}: {props.message.title}
        </h5>
        {/* Showing user email and question */}
        <h6>{props.message.userEmail}</h6>
        <p>{props.message.question}</p>
        <hr />
        <div>
          {/* Area to answer users' questions */}
          <h5>Response: </h5>
          <form action='PUT'>
            {displayWarning && (
              <div className='alert alert-danger' role='alert'>
                All fields must be filled out.
              </div>
            )}
            <div className='col-md-12 mb-3'>
              <label className='form-label'> Description </label>
              <textarea
                className='form-control'
                id='exampleFormControlTextarea1'
                rows={3}
                onChange={(e) => setResponse(e.target.value)}
                value={response}
                placeholder='Enter your response here.'
              ></textarea>
            </div>
            <div>
              <button
                type='button'
                className='btn btn-primary mt-3'
                onClick={submitBtn}
              >
                Submit Response
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Message;

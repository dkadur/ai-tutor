import React, { Component } from 'react';
import styled from 'styled-components';
import { Label } from '../src/constants/buttons';
import Calculator from './Calculator';
import { AppState } from './AppState';
import handleInput from '../src/logic/handleInput';
import { getLabelFromKey } from '../src/logic/utils';


const StyledApp = styled.main`
  text-align: center;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class App extends Component<{}, AppState> {
  private appDiv = React.createRef<HTMLDivElement>();

  constructor(props: {}) {
    super(props);
    this.state = {
      displayValue: '0',
      expression: '',
      isResult: false,
      error: '',
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount(): void {
    if (this.appDiv.current) this.appDiv.current.focus();
  }

  handleClick(label: Label): void {
    this.setState(
      prevState =>
        handleInput(label, { ...prevState }) as Pick<AppState, keyof AppState>,
    );
  }

  handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>): void {
    e.preventDefault();
    const label = getLabelFromKey(e.key);
    if (label)
      this.setState(
        prevState =>
          handleInput(label, prevState) as Pick<AppState, keyof AppState>,
      );
  }

  render(): JSX.Element {
    const { displayValue, expression, error } = this.state;
    return (
      <StyledApp
        id="main"
        tabIndex={0}
        ref={this.appDiv}
        onKeyDown={this.handleKeyDown}
      >
        <Calculator
          handleClick={this.handleClick}
          result={displayValue}
          expression={expression}
          error={error}
        />
      </StyledApp>
    );
  }
}

export default App;

import React, { useState, ChangeEvent, useEffect } from 'react'
import Autosuggest from 'react-autosuggest'
import { Button, Modal, ModalHeader, ModalBody, FormGroup } from 'reactstrap'

import './suggestion-theme.css'
import { Player } from './types'
import { PLAYERS_URL } from './constants'

const Suggestion: React.FC<{ addPlayer: Function }> = ({ addPlayer }) => {
  const [modal, setModal] = useState(false)
  const [value, setValue] = useState('')
  const [suggestions, setSuggestions] = useState<Player[]>([])
  const [players, setPlayers] = useState<Player[]>([])

  useEffect(() => {
    fetch(`${PLAYERS_URL}?select=lastName,id,firstName`)
      .then(r => r.json())
      .then(data => {
        console.log(data)
        setPlayers(data)
      })
  }, [])

  const toggle = () => {
    onSuggestionsFetchRequested({ value })
    setModal(!modal)
  }

  const getSuggestions = (value: string) => {
    const escapedValue = value.trim()

    if (escapedValue === '') {
      return players
    }

    const regex = new RegExp('^' + escapedValue, 'i')

    return players.filter(player => regex.test(player.lastName))
  }

  const getSuggestionValue = (suggestion: any) => suggestion.lastName

  const renderSuggestion = (suggestion: any) =>
    `${suggestion.lastName} ${suggestion.firstName}`

  const onChange = (event: ChangeEvent, { newValue }: any) => {
    setValue(newValue)
  }

  const onSuggestionsFetchRequested = ({ value }: any) => {
    console.log('fetch')
    setSuggestions(getSuggestions(value))
  }

  const onSuggestionSelected = (event: any, { suggestion }: any) => {
    console.log('selected')
    setModal(false)
    setValue('')
    addPlayer(suggestion)
  }

  return (
    <FormGroup style={{ width: '100%' }}>
      <Button color="danger" onClick={toggle} style={{ width: '100%' }}>
        Добавить игрока
      </Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Пожалуйста выберете игрока</ModalHeader>
        <ModalBody>
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionSelected={onSuggestionSelected}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={{
              placeholder: 'Начните ввод',
              value,
              onChange: onChange,
              spellCheck: false,
            }}
            theme={{
              container: 'react-autosuggest__container',
              containerOpen: 'react-autosuggest__container--open',
              inputOpen: 'react-autosuggest__input--open',
              inputFocused: 'react-autosuggest__input--focused',
              suggestionsContainer: 'react-autosuggest__suggestions-container',
              suggestionsContainerOpen:
                'react-autosuggest__suggestions-container--open',
              suggestionsList: 'react-autosuggest__suggestions-list',
              suggestion: 'list-group-item list-group-item-action suggestion',
              // suggestionFirst: 'react-autosuggest__suggestion--first',
              // suggestionHighlighted:
              //   'react-autosuggest__suggestion--highlighted',
              sectionContainer: 'react-autosuggest__section-container',
              sectionContainerFirst:
                'react-autosuggest__section-container--first',
              sectionTitle: 'react-autosuggest__section-title',
              input: 'form-control',
            }}
            alwaysRenderSuggestions={true}
          />
        </ModalBody>
      </Modal>
    </FormGroup>
  )
}

export default Suggestion

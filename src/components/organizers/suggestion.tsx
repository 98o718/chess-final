import React, { useState, ChangeEvent, useEffect } from 'react'
import Autosuggest from 'react-autosuggest'
import { Button, Modal, ModalHeader, ModalBody, FormGroup } from 'reactstrap'

import './suggestion-theme.css'
import { Tournament } from './types'
import { TOURNAMENTS_URL } from './constants'

const Suggestion: React.FC<{ addTournament: Function }> = ({
  addTournament,
}) => {
  const [modal, setModal] = useState(false)
  const [value, setValue] = useState('')
  const [suggestions, setSuggestions] = useState<Tournament[]>([])
  const [tournaments, setTournaments] = useState<Tournament[]>([])

  useEffect(() => {
    fetch(`${TOURNAMENTS_URL}?select=name,id`)
      .then(r => r.json())
      .then(data => {
        console.log(data)
        setTournaments(data)
      })
  }, [])

  const toggle = () => {
    onSuggestionsFetchRequested({ value })
    setModal(!modal)
  }

  const getSuggestions = (value: string) => {
    const escapedValue = value.trim()

    if (escapedValue === '') {
      return tournaments
    }

    const regex = new RegExp('^' + escapedValue, 'i')

    return tournaments.filter(tournament => regex.test(tournament.name))
  }

  const getSuggestionValue = (suggestion: Tournament) => suggestion.name

  const renderSuggestion = (suggestion: Tournament) => suggestion.name

  const onChange = (event: ChangeEvent, { newValue }: any) => {
    setValue(newValue)
  }

  const onSuggestionsFetchRequested = ({ value }: any) => {
    setSuggestions(getSuggestions(value))
  }

  const onSuggestionSelected = (event: any, { suggestion }: any) => {
    setModal(false)
    setValue('')
    addTournament(suggestion)
  }

  return (
    <FormGroup style={{ width: '100%' }}>
      <Button color="danger" onClick={toggle} style={{ width: '100%' }}>
        Добавить турнир
      </Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Пожалуйста выберете турнир</ModalHeader>
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

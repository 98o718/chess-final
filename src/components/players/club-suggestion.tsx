import React, { useState, ChangeEvent, useEffect } from 'react'
import Autosuggest from 'react-autosuggest'
import { Button, Modal, ModalHeader, ModalBody, FormGroup } from 'reactstrap'

import './suggestion-theme.css'
import { Club } from './types'
import { CLUBS_URL } from './constants'

const Suggestion: React.FC<{ addClub: Function }> = ({ addClub }) => {
  const [modal, setModal] = useState(false)
  const [value, setValue] = useState('')
  const [suggestions, setSuggestions] = useState<Club[]>([])
  const [clubs, setClubs] = useState<Club[]>([])

  useEffect(() => {
    fetch(`${CLUBS_URL}?select=name,id`)
      .then(r => r.json())
      .then(data => {
        console.log(data)
        setClubs(data)
      })
  }, [])

  const toggle = () => {
    onSuggestionsFetchRequested({ value })
    setModal(!modal)
  }

  const getSuggestions = (value: string) => {
    const escapedValue = value.trim()

    if (escapedValue === '') {
      return clubs
    }

    const regex = new RegExp('^' + escapedValue, 'i')

    return clubs.filter(club => regex.test(club.name))
  }

  const getSuggestionValue = (suggestion: Club) => suggestion.name

  const renderSuggestion = (suggestion: Club) => suggestion.name

  const onChange = (event: ChangeEvent, { newValue }: any) => {
    setValue(newValue)
  }

  const onSuggestionsFetchRequested = ({ value }: any) => {
    setSuggestions(getSuggestions(value))
  }

  const onSuggestionSelected = (event: any, { suggestion }: any) => {
    setModal(false)
    setValue('')
    addClub(suggestion)
  }

  return (
    <FormGroup style={{ width: '100%' }}>
      <Button color="danger" onClick={toggle} style={{ width: '100%' }}>
        Выбрать клуб
      </Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Пожалуйста выберете клуб</ModalHeader>
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

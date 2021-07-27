import React, { useState, useEffect, useRef } from 'react'
import { useFetch } from 'context/FetchContext'
import { Input, PrimaryButton, SecondaryButton } from 'components/lib'
import { ModalContext } from 'components/modal/animatedModal'
export function UploadFiles() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedFileName, setSelectedFileName] = useState(null)
  const [isSuccess, setIsSuccess] = React.useState(null)
  const [progress, setProgress] = useState()
  const [, setIsOpen] = React.useContext(ModalContext)
  const hiddenFileInput = useRef(null)
  const { authClient } = useFetch()
  const changeHandler = (event) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0])
    }
  }

  useEffect(() => {
    if (selectedFile) setSelectedFileName(selectedFile.name.substring(0, 25))
    if (!selectedFile) setSelectedFileName(null)
  }, [selectedFile])

  const handleClear = (e) => {
    e.preventDefault()
    setSelectedFile(null)
    setProgress(null)
  }

  const clickHandler = (e) => {
    e.preventDefault()
    hiddenFileInput.current.click()
  }
  const submitHandler = (e) => {
    e.preventDefault()
    let formData = new FormData()
    formData.append('file', selectedFile)
    //     selectFile.forEach((element) => {
    //       formData.append('file', element)
    //     })
    authClient(`upload`, {
      method: 'POST',
      files: formData,
      onUploadProgress: (data) => {
        //Set the progress value to show the progress bar
        //avoid bug: start as 100%
        if (data.total > 177) {
          let progress = Math.round((100 * data.loaded) / data.total)
          setProgress(progress)
        }
      },
    })
      .then((response) => {
        setIsSuccess(response)
        setTimeout(() => {
          console.log('closing')
          setIsOpen(false)
        }, 1100)
      })
      .catch((error) => console.log(error))
  }

  return (
    <form>
      <div className="container flex p-4 mx-auto space-x-6 rounded bg-coolGray-700">
        {selectedFile === null ? (
          <PrimaryButton onClick={clickHandler}>Select A File</PrimaryButton>
        ) : (
          <SecondaryButton onClick={handleClear}>Clear</SecondaryButton>
        )}
        <p className="flex items-center text-lg">{selectedFileName}</p>
        {/* 
        hide input field, 
        use ref to activate this input field
        use customized button above to browse local files 
        */}
        <Input
          onChange={changeHandler}
          className="hidden"
          ref={hiddenFileInput}
          name="sound file"
          type="file"
        />
      </div>
      <div className="pt-4">
        {selectedFile ? (
          <PrimaryButton onClick={submitHandler}>submit</PrimaryButton>
        ) : (
          <SecondaryButton disabled>submit</SecondaryButton>
        )}
        {progress ? (
          <div className="relative pt-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="inline-block px-2 py-1 text-xs font-semibold text-teal-600 uppercase bg-teal-200 rounded-full">
                  {isSuccess ? (
                    <div>{isSuccess}</div>
                  ) : (
                    <div> Upload in progress</div>
                  )}
                </span>
              </div>
              <div className="text-right">
                <span className="inline-block text-xs font-semibold text-teal-600">
                  {`${progress}%`}
                </span>
              </div>
            </div>
            <div className="flex h-2 mb-4 overflow-hidden text-xs bg-teal-200 rounded">
              <div
                style={{ width: `${progress}%` }}
                className="flex flex-col justify-center text-center text-white bg-teal-500 shadow-none whitespace-nowrap"
              ></div>
            </div>
          </div>
        ) : null}
      </div>
    </form>
  )
}

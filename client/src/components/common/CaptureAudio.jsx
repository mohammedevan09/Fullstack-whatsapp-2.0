import React, { useEffect, useRef, useState } from 'react'
import {
  FaMicrophone,
  FaPauseCircle,
  FaPlay,
  FaStop,
  FaTrash,
} from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { socket } from '../Main'
import { MdSend } from 'react-icons/md'
import WaveSurfer from 'wavesurfer.js'

function CaptureAudio({ hide }) {
  const { userInfo, currentChatUser } = useSelector((state) => state?.user)

  const [isRecording, setIsRecording] = useState(false)
  const [recordedAudio, setRecordedAudio] = useState(null)
  const [waveform, setWaveform] = useState(null)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0)
  const [totalDuration, setTotalDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [renderedAudio, setRenderedAudio] = useState(null)

  const audioRef = useRef(null)
  const mediaRecorderRed = useRef(null)
  const waveFormRef = useRef(null)

  useEffect(() => {
    let interval
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prevDuration) => {
          setTotalDuration(prevDuration + 1)
          return prevDuration + 1
        })
      }, 1000)
    }
  }, [isRecording])

  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: waveFormRef.current,
      waveColor: '#ccc',
      progressColor: '#419eff',
      cursorColor: '#7ae3c3',
      barWidth: 2,
      height: 30,
      responsive: true,
    })
    setWaveform(wavesurfer)

    wavesurfer.on('finish', () => {
      setIsPlaying(false)
    })

    return () => wavesurfer.destroy()
  }, [])

  useEffect(() => {
    if (waveform) handleStartRecording()
  }, [waveform])

  const formateTime = (time) => {
    if (isNaN(time)) return '00:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`
  }

  const handleStartRecording = () => {
    setRecordingDuration(0)
    setCurrentPlaybackTime(0)
    setTotalDuration(0)
    setIsRecording(true)
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorderRed.current = mediaRecorder
        audioRef.current.srcObject = stream

        const chunks = []
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' })
          const audioURL = URL.createObjectURL(blob)
          const audio = new Audio(audioURL)
          setRecordedAudio(audio)
          waveform.load(audioURL)
        }

        mediaRecorder.start()
      })
      .catch((err) => console.log(err))
  }
  const handleStopRecording = () => {
    if (mediaRecorderRed.current && isRecording) {
      mediaRecorderRed.current.stop()
      setIsRecording(false)
      waveform.stop()

      const audioChunks = []
      mediaRecorderRed.current.addEventListener('dataavailable', (e) => {
        audioChunks.push(e.data)
      })

      mediaRecorderRed.current.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' })
        const audioFile = new File([audioBlob], 'recording.mp3')
        setRenderedAudio(audioFile)
      })
    }
  }

  useEffect(() => {
    if (recordedAudio) {
      const updatePlaybackTime = () => {
        setCurrentPlaybackTime(recordedAudio.currentTime)
      }
      recordedAudio.addEventListener('timeupdate', updatePlaybackTime)
      return () => {
        recordedAudio.removeEventListener('timeupdate', updatePlaybackTime)
      }
    }
  }, [recordedAudio])

  const handlePlayRecording = () => {
    if (recordedAudio) {
      waveform.stop()
      waveform.play()
      recordedAudio.play()
      setIsPlaying(true)
    }
  }
  const handlePauseRecording = () => {
    waveform.stop()
    recordedAudio.pause()
    setIsPlaying(false)
  }

  const sendRecording = async () => {}

  return (
    <div className="flex text-2xl w-full justify-end items-center">
      <div className="pt-1">
        <FaTrash
          className="text-panel-header-icon cursor-pointer"
          onClick={() => hide()}
        />
      </div>
      <div className="mx-4 py-2 px-2 text-white text-lg flex gap-3 justify-between items-center bg-search-input-container-background rounded-full drop-shadow-lg w-full">
        {isRecording ? (
          <div className="text-red-500 animate-pulse w-60 text-center">
            Recording <span>{recordingDuration}s</span>
          </div>
        ) : (
          <div>
            {recordedAudio && (
              <>
                {!isPlaying ? (
                  <FaPlay
                    className="cursor-pointer"
                    onClick={handlePlayRecording}
                  />
                ) : (
                  <FaStop
                    className="cursor-pointer"
                    onClick={handlePauseRecording}
                  />
                )}
              </>
            )}
          </div>
        )}
        <div className="w-60" ref={waveFormRef} hidden={isRecording} />
        {recordedAudio && isPlaying && (
          <span>{formateTime(currentPlaybackTime)}</span>
        )}
        {recordedAudio && !isPlaying && (
          <span>{formateTime(totalDuration)}</span>
        )}
        <audio ref={audioRef} hidden></audio>

        <div className="flex gap-3">
          <div>
            {!isRecording ? (
              <FaMicrophone
                className="text-red-500 cursor-pointer"
                onClick={handleStartRecording}
                size={28}
              />
            ) : (
              <FaPauseCircle
                className="text-red-500 cursor-pointer"
                onClick={handleStopRecording}
                size={28}
              />
            )}
          </div>
          <div>
            <MdSend
              className="text-panel-header-background cursor-pointer mr-4"
              title="Send"
              onClick={sendRecording}
              size={28}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CaptureAudio

import { setFilterContacts } from '@/context/userReducer'
import React from 'react'
import { BiSearchAlt2 } from 'react-icons/bi'
import { BsFilter } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'

function SearchBar() {
  const dispatch = useDispatch()
  return (
    <div className=" flex py-3 pl-5 items-center gap-3 h-14">
      <div className="flex bg-panel-header-background items-center gap-4 px-3 py-1 rounded-lg flex-grow">
        <div>
          <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-lg" />
        </div>
        <div>
          <input
            type="text"
            placeholder="Search or start a new chat"
            className="text-xm bg-transparent text-white focus:outline-none w-full"
            onChange={(e) => dispatch(setFilterContacts(e.target.value))}
          />
        </div>
      </div>
      <div className="pr-5 pl-3">
        <BsFilter className="text-panel-header-icon cursor-pointer text-lg" />
      </div>
    </div>
  )
}

export default SearchBar

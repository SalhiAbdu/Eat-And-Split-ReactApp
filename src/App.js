import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

let Button  = ({children, onClick}) => {
  return <button className='button' onClick={onClick}>{children}</button>
}


function App() {
  let [friends, setFriends] = useState(initialFriends)
  let [showAddForm, setAddFrorm] = useState(false)
  let [selectedFriend, setSelectedFriend] = useState(null)

  let handleSelectedFriend = (currentSelected) =>{
    setSelectedFriend(currentSelected)
  }

  let AddNewFriend = (newFriend) =>{
    setFriends([...friends, newFriend])
  }

  let changeBalance = (value) =>{
    setFriends(friends=>    friends.map((f)=> (f.id === selectedFriend.id)?{...f, balance:f.balance + value}:f
 ))
 setSelectedFriend(null)
  }
 
  return <div className='app'>
    <div className='sidebar'>
      <FriendsList friends={friends} onSelect={handleSelectedFriend} selectedFriend={selectedFriend}/>
      {
        showAddForm && <AddFriendForm AddNewFriend={AddNewFriend}/>
      }
      <Button onClick={()=> setAddFrorm((show) => !show)}>{(showAddForm?'Close':'Add Friend')}</Button>
    </div>
    {
      selectedFriend && <FormSplitAndBill selectedFriend={selectedFriend} changeBalance={changeBalance} key={selectedFriend.id}/>
    }
  </div>
}


let FriendsList = ({friends,onSelect,selectedFriend}) =>{
  return <ul>
    {
    friends.map((friend)=> <Friend friend={friend} key={friend.id} onSelect={onSelect} selectedFriend={selectedFriend}/>)
    }
  </ul>
}

let Friend = ({friend,onSelect, selectedFriend}) => {
  return <li className={friend.id === selectedFriend?.id ? 'selected':''}>
    <img src={friend.image} alt={friend.name}  />
    <h3>{friend.name}</h3>
    {
      friend.balance < 0 && <p className='red'>You owe {friend.name} {Math.abs(friend.balance)}€</p>
    }
    {
      friend.balance > 0 && <p className='green'>{friend.name} owes you {friend.balance}€</p>
    }
    {
      friend.balance === 0 && <p>You and {friend.balance} are even</p>
    }
    <Button onClick={()=>{
      onSelect(friend)
    }}>Select</Button>
  </li>
}

let AddFriendForm = ({AddNewFriend}) => {

  let handSubmit = (e) =>{
    e.preventDefault()
    let id = crypto.randomUUID()
    const newFriend = {
      id,
      name,
      image : `${imageUrl}?u=${id}`,
      balance:0
    }
    AddNewFriend(newFriend)
    setName("")
    setImageUrl("https://i.pravatar.cc/48")
  }

  let [name,setName] = useState("")
  let [imageUrl, setImageUrl] = useState("https://i.pravatar.cc/48")
  return <form className='form-add-friend' onSubmit={(e) => handSubmit(e)}>
    <label >💁‍♂️ Friend Name</label>
    <input type="text" onChange={(e) => setName(e.target.value)} value={name}/>
     <label >🎆 Image Url</label>
    <input type="text" onChange={(e) => setImageUrl(e.target.value) } value={imageUrl}/>
    <Button>Add</Button>
  </form>
}

let FormSplitAndBill = ({selectedFriend, changeBalance}) => {
  let [bill, setBill] = useState(0)
  let [expense, setExpense] = useState(0)
  let [whosPaying, setWhosPaying] = useState("you")
  let friendsExpense = (bill>0 && bill>expense) ? bill - expense : ''

  let handleSplitForm = (e) => {
    e.preventDefault()
    changeBalance((whosPaying === 'you') ? friendsExpense : -expense)
  }
  
  
  return <form className='form-split-bill' onSubmit={(e) => handleSplitForm(e)}>
    <h2>Split the bill with {selectedFriend.name}</h2>
    <label >💰 Bill value</label>
    <input type="text" onChange={(e)=> {
      setBill(Number(e.target.value))
    }}/>
    <label >💁‍♂️ Your expense</label>
    <input type="text" onChange={(e)=> {
      setExpense(Number(e.target.value))
    }}/>
    <label >👧 {selectedFriend.name}'s expense</label>
    <input type="text" disabled value={friendsExpense}/>
    <label >🤑 Who's paying the bill?</label>
    <select onChange={(e)=> setWhosPaying(e.target.value)}>
      <option value="you">you</option>
      <option value="friend">{selectedFriend.name}</option>
    </select>
    <Button>Split Bill</Button>
  </form>
}


export default App;

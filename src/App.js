//import logo from './logo.svg';
import './App.css';
import Header from './Header';
import AddItem from './AddItem';
import SearchItem from './SearchItem';
import Content2 from './Content2';
import Footer1 from './Footer1';
import {useState, useEffect} from 'react';
import apiRequest from './apiRequest';

function App() {
    /*const [items,setItems] = useState([
      {
          id: 1,
          checked: true,
          item: "One half pound bag of Cocoa Covered Almonds Unsalted"
      }, {
          id: 2,
          checked: false,
          item: "Item2"
      }, {
          id: 3,
          checked: false,
          item: "Item3"
      }
  ]);*/

    const API_URL = 'http://localhost:3501/items';

    // 아래의 코드 끝에서와 같이 빈 배열을 넣어주는건 만약에 이 서비스의 최초 사용자가 로컬 저장소에 아무것도 갖고 있지 않은 초기상태에서 처음
    // 쓰게 됐을 때 그러한 null 상태에 대해 코드가 작동하게 되고 그 과정에서 null에 대해 filter를 걸게 되면서 생길 오류를
    // 방지하기 위한 일종의 최초시점을 위한 초기값의 성격도 있다. 결국 아래의 코드 에선 만약에 Json.parse 부분이 null인 경우라면
    // []가 대입되게 되는 형태다. 이는 심지어 디버깅 화면의 application에서 수동으로 직접 로컬 저장소의 shoppinglist를
    // 삭제했어도 새로고침 해주면 다시 빈 shoppinglist를 제공해주는 형태로 견고함을 유지시켜 주는 효과도 갖는다. const
    // [items,setItems] = useState(  JSON.parse(localStorage.getItem('shoppinglist')
    // || [])); 여기서 빈 문자열이 최초로 어플리케이션을 열 때 함께 갖고 시작하길 바라는 초기값이다.
    const [items,
        setItems] = useState([]);

    const [newItem,
        setNewItem] = useState('');
    const [search,
        setSearch] = useState('');

    // catch에서 잡히지 않는 fetch 에러를 잡기 위한 useState
    const [fetchError,
        setFetchError] = useState(null);

    // 받아올 데이터의 로딩 중을 알리는 state
    const [isLoading,
        setIsLoading] = useState(true);

    // 여기서는 빈 문자열을 dependency로써 가진 useEffect를 사용할 것이다. 이로써 이는 오직 처음 로딩 타임 때만 일어날
    // 것이다. 이런 형태의 장점 중 하나는 아래의 정의된 함수가 처음 로딩때만 생성되고 만다는 것이다. 자칫 재 렌더링 마다 매번 또 다시
    // 생성하는 등의 일이 없이 말이다.
    useEffect(() => {
        // 아래는 함수를 정의는 했어도 아직 실제 호출은 하지 않은 상태다. 결국 그 아래에서 별도로 이 함수를 호출하는 라인이 들어간다.
        const fetchItems = async() => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) { // 이게 없을시 catch 블록으로 빠지질 못하고
                    // 그냥 404 에러 단독으로 내고 만다.
                    throw Error('Did not receive expected data');
                }
                const listItems = await response.json();
                setItems(listItems);

                // 성공적인 response를 받았을 경우에는 setFetchError를 써서 fetchError에 기존에 이미 들어가 있을 수 있는 에러
                // 관련 값을 성공적인 응답이 있었으니 정리해준다.
                setFetchError(null);
            } catch (err) {
                // 이렇게 받은 에러 메시지를 콘솔이 아닌  보내서 활용하는 쪽으로 살린다.
                setFetchError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
        setTimeout(() => { // 응답 받아오는데 긴 시간 걸리는 상태 시뮬
            (async() => await fetchItems())();
        }, 2000);

    }, []) // operation that happens once only in load time.
    // 참고로 useEffect와 async의 조합을 아래와 같은 형태로 쓰는 건 불가능하다.
    /*useEffect(async () => {

  }, [])*/

    const addItem = async(item) => {
        const id = items.length
            ? items[items.length - 1].id + 1
            : 1;
        const myNewItem = {
            id,
            checked: false,
            item
        };
        const listItems = [
            ...items,
            myNewItem
        ];
        setItems(listItems);

        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // 새 추가 요소가 들어간 새로운 목록 전체를 보낼 필요없이 그저 새로이 추가되는 요소 그 자체만을 보낸다.
            body: JSON.stringify(myNewItem)
        };
        const result = await apiRequest(API_URL, postOptions);
        if (result) {
            setFetchError(result);
        }
    }

    const handleCheck = async(id) => {
        const listItems = items.map((item) => item.id === id
            ? {
                ...item,
                checked: !item.checked
            }
            : item);
        setItems(listItems);

        // id가 동일한 요소는 리스트 전체에서 하나뿐이므로, 여기선 filter의 결과로 단일 요소가 들어있는 배열을 반환 아래쪽에서 myItem이
        // 아닌 myItem[0]을 쓰는 이유다.
        const myItem = listItems.filter(item => item.id === id);
        const updateOptions = {
            method: 'PATCH',
            header: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({checked: myItem[0].checked})
        }
        const reqUrl = `${API_URL}/${id}`;
        const result = await apiRequest(reqUrl, updateOptions);
        if (result) {
            setFetchError(result);
        }
    }

    const handleDelete = async(id) => {
        const listItems = items.filter((item) => item.id !== id);
        setItems(listItems);

        const deleteOptions = {
            method: 'DELETE'
        };
        const reqUrl = `${API_URL}/${id}`;
        const result = await apiRequest(reqUrl, deleteOptions);
        if (result) {
            setFetchError(result);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // 필수라고 지정해놨기 때문에 빈 문자열의 입력이 있을 수는 없겠지만 이에 대해 아래와 같이 체크해볼 수는 있다.
        if (!newItem) {
            return;
        }

        // addItem
        addItem(newItem);
        setNewItem('')

    }

    return (
        <div className='App'>
            <Header title='Grocery List'/>
            <AddItem newItem={newItem} setNewItem={setNewItem} handleSubmit={handleSubmit}/>
            <SearchItem search={search} setSearch={setSearch}/>
            <main>
                {isLoading && <p>Loading Items...</p>}
                {fetchError && <p style={{
                    color: "red"
                }}>{`Error: ${fetchError}`}</p>}
                {/*아래의 경우 에러가 없고 로딩이 아닐 때만 Content2를 표시한다*/}
                {!fetchError && !isLoading && <Content2
                    items={items.filter(item => ((item.item).toLowerCase()).includes(search.toLowerCase()))}
                    handleCheck={handleCheck}
                    handleDelete={handleDelete}/>}
            </main>
            <Footer1 length={items.length}/>
        </div>
    );

}

export default App;

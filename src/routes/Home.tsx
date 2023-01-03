// https://api.coinpaprika.com/#tag/Tags/paths/~1tags/get
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import styled from "styled-components";
import { FetchCoins } from "../api";
import { ICoinList, ICoin } from "../interface";
import Coins from "../Components/Coins";
import DarkToggle from "./DarkToggle";
import { useRecoilState, useRecoilValue } from "recoil";
import { CategoryState } from "../atoms";
import { useEffect } from "react";

interface ICoinsProps {}

function Home({}: ICoinsProps) {
  const [category, setCategory] = useRecoilState(CategoryState);

  const { isLoading, data, isError, refetch } = useQuery<ICoinList[]>(
    ["allCoins"],
    () => FetchCoins(category)
    // { enabled: !!category }
  );
  // 첫 랜더 시 로딩이 보이고 그 이후부턴 로딩이 안보이는 이유(detail페이지 갔다와도) : react query가 데이터를 캐시에 저장해둔다.

  const onChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    setCategory(undefined as any);
    setCategory(event.target.value as any);
  };

  useEffect(() => {
    refetch();
  }, [refetch, category]);

  let state = "ok";
  if (isLoading) state = "loading";
  if (isError) state = "error";

  return (
    <Container>
      <Helmet>
        <title>Coin</title>
      </Helmet>
      <DarkToggle />
      {state === "error" && "error!"}
      {state === "loading" && <Loader> Loading...</Loader>}
      {state === "ok" && data && (
        <>
          <CoinWrapper>
            <div>{category}</div>
            <Select onChange={onChanged} onClick={() => refetch}>
              <option value="rank">랭크순</option>
              <option value="asc">오름차순</option>
              <option value="desc">내림차순</option>
            </Select>
            <Card>
              <Coins data={data[0].coin} type={"coin"} />
            </Card>
            <Card>
              <Coins data={data[0].token} type={"token"} />
            </Card>
          </CoinWrapper>
        </>
      )}
    </Container>
  );
}

const Container = styled.div`
  padding: 100px 20px 0 20px;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 60px;
`;

const CoinWrapper = styled.li`
  display: flex;
  justify-content: space-around;
`;
const Select = styled.select`
  height: 20px;
`;
const Card = styled.div`
  width: 40%;
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

export default Home;

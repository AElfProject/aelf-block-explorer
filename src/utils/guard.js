// v1.2.2 change some url so have to map it
const RANDOM_URL_MAP = {
  address: "accounts",
  contract: "contracts",
  token: "token",
};
//global routes guard
export function guard(location, navigate) {
  const { pathname } = location;
  const hash = location.hash;
  let url = "";
  let _,
    route = "",
    rest = [];
  let item = "";
  //compatible with old url
  if (hash) {
    const decodeHash = decodeURIComponent(hash).substring(1);
    if (decodeHash.indexOf("viewer") > -1) {
      // handle url such as `/address?#http%3A%2F%2F10.147.20.67%3A8888%2Fviewer%2Faddress.html%23%2Faddress%2FYUW9zH5GhRboT5JK4vXp5BLAfCDv28rRmTQwo418FuaJmkSg8`
      // and then jump to `/viewer/address.html#/address/YUW9zH5GhRboT5JK4vXp5BLAfCDv28rRmTQwo418FuaJmkSg8`
      url = decodeHash;
    } else if (pathname.indexOf("viewer") > -1) {
      // handle url such as `/viewer/address.html#/address/YUW9zH5GhRboT5JK4vXp5BLAfCDv28rRmTQwo418FuaJmkSg8`
      if (hash.indexOf("random") > -1) {
        // handle url sunch as `/address?#http%3A%2F%2F10.147.20.67%3A8888%2Fviewer%2Faddress.html%23%2Faddress%3Frandom%3D9337b6a0`
        // remove #/
        route = hash.split("?")[0].substr(2);
        url = RANDOM_URL_MAP[route];
      } else if (pathname.indexOf("proposal") > -1) {
        // handle proposal, becasue we add '/proposal' as parent url after repo merge
        [_, route, ...rest] = hash.split("/");
        item = rest.join("/");
        url = `/proposal/${route}/${item}`;
      } else {
        [_, route, ...rest] = hash.split("/");
        item = rest.join("/");
        url = item ? `/${route}/${item}` : `/${route}`;
      }
    }
    navigate(url);
    return false;
  }
  return true;
}

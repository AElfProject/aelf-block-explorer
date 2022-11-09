//global routes guard
export function guard(location, navigate) {
  const { pathname } = location;
  const hash = location.hash;
  let url = "";
  //Compatible with old url
  if (pathname.indexOf("proposal") > -1 && hash) {
    const decodeHash = decodeURIComponent(hash).substring(1);
    if (decodeHash.indexOf("viewer") > -1) {
      const route = decodeHash.split("#/")[1];
      url = `/proposal/${route}`;
    }
    navigate(url);
    return false;
  } else if (pathname.indexOf("viewer") > -1) {
    const route = hash.split("/")[1];
    const item = hash.split("/")[2];
    url = item ? `/${route}/${item}` : `/${route}`;
    navigate(url);
    return false;
  }
  return true;
}

const transformFirebaseDataToViewModel = (docs) => (docs.map((doc) => {
  const { id } = doc;
  const data = doc.data();
  return { id, ...data };
}));

export default transformFirebaseDataToViewModel;

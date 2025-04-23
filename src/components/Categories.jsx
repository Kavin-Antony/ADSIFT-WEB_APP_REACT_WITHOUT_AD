import '../styles/Categories.css';

const categories = [
  "Top Charts",
  "New Releases",
  "Trending",
  "Playlists",
  "Discover",
  "Genres",
  "Pop",
  "Rock",
  "Hip-Hop",
  "Indie",
  "Jazz",
  "Classical",
  "Electronic",
  "R&B",
  "Reggae",
  "Dance",
  "Chill",
  "Acoustic",
  "Podcasts",
  "Workout"
]

const Categories = () => {
  return (
    <div className="categories">
      {categories.map((category, index) => (
        <button key={index} onClick={() => alert(`Clicked ${category}`)}>
          {category}
        </button>
      ))}
    </div>
  );
};

export default Categories;

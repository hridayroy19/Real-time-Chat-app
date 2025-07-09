const Profile = () => {
  return (
    <div className="min-h-screen  flex items-center justify-center px-4">
      <div className="flex flex-col lg:flex-row items-center gap-8 max-w-4xl w-full">
        {/* Image */}
        <div className="flex-shrink-0">
          <img
            src="https://i.ibb.co/6byJgXB/sample-woman.jpg"
            alt="Profile"
            className="w-60 h-60 object-cover rounded-full border-4 border-gray-300"
          />
        </div>

        {/* Text Content */}
        <div className="text-center lg:text-left space-y-4">
          <h1 className="text-4xl font-bold text-white">Hello</h1>
          <div>
            <h2 className="text-lg font-semibold text-white">A Bit About Me</h2>
            <p className="text-white max-w-md mx-auto lg:mx-0">
              I'm a paragraph. Click here to add your own text and edit me. I’m
              a great place for you to tell a story and let your users know a
              little more about you.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-center lg:justify-start gap-4 pt-2 flex-wrap">
            <button className="bg-yellow-400 hover:bg-yellow-500 px-6 py-2 rounded-full font-semibold transition">
              Resume
            </button>
            <button className="bg-red-400 hover:bg-red-500 px-6 py-2 rounded-full font-semibold transition">
              Projects
            </button>
            <button className="bg-cyan-400 hover:bg-cyan-500 px-6 py-2 rounded-full font-semibold transition">
              Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

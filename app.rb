require 'sinatra'
require 'json'

# one way to prevent typos is to create variables for constants that are used throughout
datafile = 'data.json'

# this function 'gets' the html page
get '/' do # 'do' is a command that executes the code that follows
  File.read('views/index.html')
  # because 'index.html' is a file located in the "views" folder, 
  # the location of the file must include the name of its parent folder
end

# this function 'gets' the list of favorited movie from the data file
get '/favorites' do # don't forget the backslash! every character counts
  response.header['Content-Type'] = 'application/json'
  File.read(datafile)
end

# this function 'posts' a movie to the data file, when the 'save to favorites' button is clicked
post '/favorites' do
  read_file = File.read(datafile)
  file = JSON.parse(read_file)
  # 'unless' opens a conditional block that needs to be closed with an 'end'
  unless params[:Title] && params[:imdbID]
    return 'Invalid Request'
  end
  # creating a movie object that will be added to the data file
  movie = {Title: params[:Title], Year: params[:Year], imdbID: params[:imdbID] }
  puts movie
  # adding and saving the new object into the file
  file['favorites'].push(movie)
  File.write(datafile,JSON.pretty_generate(file))
  file.to_json 
end

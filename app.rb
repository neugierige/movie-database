require 'sinatra'
require 'json'

datafile = 'data.json'

get '/' do # 'do' is a command that executes the code that follows
  File.read('views/index.html')
  # because 'index.html' is a file located in the "views" folder, 
  # the location of the file must include the name of its parent folder
end

get '/favorites' do # don't forget the backslash! every character counts.
  response.header['Content-Type'] = 'application/json'
  File.read(datafile)
end

post '/favorites' do
  read_file = File.read(datafile)
  file = JSON.parse(read_file)
  unless params[:name] && params[:oid]
    return 'Invalid Request'
  end
  # 'unless' opens a conditional block that needs to be closed with an 'end'
  movie = {Title: params[:name], Year: params[:year], imbdID: params[:oid] }
  file['favorites'].push(movie)
  File.write(datafile,JSON.pretty_generate(file))
  file.to_json  
end

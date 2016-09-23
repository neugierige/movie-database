require 'sinatra'
require 'json'

get '/' do 
# 'do' is a command that executes the code that follows
  File.read('views/index.html')
  # because 'index.html' is a file located in the "views" folder, 
  # the location of the file must include the name of its parent folder
end

get '/favorites' do 
# don't forget the backslash! remember, computers are dumb.  
# they can only do what you tell it, so every character counts.
  response.header['Content-Type'] = 'application/json'
  File.read('data.json')
end

post '/favorites' do
  file = JSON.parse(File.read('data.json'))
  unless params[:name] && params[:oid]
    return 'Invalid Request'
  end
  # 'unless' opens a conditional block that needs to be closed with an 'end'
  movie = { name: params[:name], oid: params[:oid] }
  file << movie
  File.write('data.json',JSON.pretty_generate(file))
  movie.to_json
end

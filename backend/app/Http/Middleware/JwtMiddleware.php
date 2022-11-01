<?php

namespace App\Http\Middleware;

use Closure;
use JWTAuth;
use Exception;
use Tymon\JWTAuth\Http\Middleware\BaseMiddleware;
class JwtMiddleware extends BaseMiddleware
{

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
        } catch (Exception $e) {
            $respone['api_status'] = 401;
            if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenInvalidException){
                $respone['api_message'] = 'Token is Invalid';
            }else if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenExpiredException){
                $respone['api_message'] = 'Token is Expired';
            }else{
                $respone['api_message'] = 'Authorization Token not found';
            }
            return response()->json($respone);
        }
        return $next($request);
    }
}
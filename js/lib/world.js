
function world()
{
    const MAX_X_VELOCITY = 200;
    const MAX_Y_VELOCITY = 200;

    const MIN_X_VELOCITY = -200;
    const MIN_Y_VELOCITY = -200;

    var _p = new player();
    var _blocks = new gamejs.sprite.Group();

    _blocks.add( new block() );

    this.handleInput = function()
    {
        gamejs.event.get().forEach(function(event)
        {
            if ( event.type === gamejs.event.KEY_DOWN )
            {
                switch( event.key )
                {
                    case gamejs.event.K_SPACE:
                        if ( !_p.getJumping() )
                        {
                            _p.setVelocity( _p.getVelocity().x, MIN_Y_VELOCITY );
                            _p.setJumping(true);
                        }
                        break;

                    case gamejs.event.K_LEFT:
                        _p.setVelocity( MIN_X_VELOCITY, _p.getVelocity().y );
                        break;

                    case gamejs.event.K_RIGHT:
                        _p.setVelocity( MAX_X_VELOCITY, _p.getVelocity().y );
                        break;

                    case gamejs.event.K_c:
                        _p.clone();
                        break;
                    case gamejs.event.K_TAB:
                        _p.moveToNext();
                }
            }

            if ( event.type === gamejs.event.KEY_UP)
            {
                switch( event.key )
                {   
                    case gamejs.event.K_LEFT:
                    case gamejs.event.K_RIGHT:
                        _p.setVelocity( 0, _p.getVelocity().y );
                        break;
                }
            }
        });
    }

    this.update = function( msDuration )
    {
        //Apply the gravitational pull of the world, and update the
        //player positions
        _applyGravity();
        _p.update( msDuration );

        //Apply the collision detection, including any minor amends to player
        //x and y positions
        _applyCollisions();
    }

    this.draw = function ( mainSurface )
    {
        _p.draw( mainSurface );
        _blocks.draw( mainSurface );
    }

    var _applyGravity = function()
    {
        _p.getPlayables().forEach(function(obj){
            obj.setVelocity( obj.getVelocity().x, (obj.getVelocity().y + 10) )
            _sanatiseVelocity(obj);
        });
    }

    var _sanatiseVelocity = function(obj)
    {
        var velocity = obj.getVelocity();

        velocity.x = Math.max( MIN_X_VELOCITY, velocity.x );
        velocity.x = Math.min( MAX_X_VELOCITY, velocity.x );

        velocity.y = Math.max( MIN_Y_VELOCITY, velocity.y );
        velocity.y = Math.min( MAX_Y_VELOCITY, velocity.y );

        obj.setVelocity( velocity.x, velocity.y );
    }

    var _applyCollisions = function()
    {
        var colliders = (gamejs.sprite.groupCollide(_p.getPlayables(), _blocks));
        for( var i = 0; i < colliders.length; i++ )
        {
            var playable = colliders[i].a;
            var block    = colliders[i].b;

            var topEdge = [
                [block.rect.left, block.rect.top], [block.rect.right, block.rect.top]
            ];

            var leftEdge = [
                [block.rect.left, block.rect.top], [block.rect.left, block.rect.bottom]
            ];

            var rightEdge = [
                [block.rect.right, block.rect.top], [block.rect.right, block.rect.bottom]
            ];

            if ( playable.getVelocity().y > 0
                && playable.rect.collideLine(topEdge[0], topEdge[1])
            )
            {
                playable.setVelocity( playable.getVelocity().x, 0 );
                playable.rect.bottom = (block.rect.top - 0.25);
                playable.setJumping(false);
            }

            if ( playable.getVelocity().x > 0
                && playable.rect.collideLine(leftEdge[0], leftEdge[1])
            )
            {
                playable.setVelocity( 0, playable.getVelocity().y );

            }
            else if ( playable.getVelocity().x < 0
                && playable.rect.collideLine(rightEdge[0], rightEdge[1])
            )
            {
                playable.setVelocity( 0, playable.getVelocity().y );
            }
        }
    }
}